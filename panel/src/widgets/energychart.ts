import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import type { HomeAssistant } from "../types/hass.js";
import {
  bucketLabel,
  fetchStatistics,
  statisticsRange,
  type StatBucket,
  type StatPeriod,
} from "../home-assistant/statistics.js";
import type { EnergyChartPeriod, EnergyChartWidgetOptions } from "../config/widget-options.js";
import type { EChartsOption } from "../primitives/echart.js";
import {
  ENERGY_COLORS,
  nowMarkLine,
  resolveChartTheme,
  roundedTop,
  tooltipHtml,
  tooltipStyle,
  vGradient,
  type ChartTheme,
} from "../energy/chart-style.js";
import "./widget-frame.js";
import "../primitives/echart.js";
import "../primitives/segmented.js";
import { KeyedAsyncController } from "../controllers/keyed-async-controller.js";

/** Series definitions in draw order, mapped to option ids at render time. */
const SERIES = [
  { key: "solar", label: "Solar", color: ENERGY_COLORS.solar },
  { key: "gridImport", label: "Import", color: ENERGY_COLORS.import },
  { key: "gridExport", label: "Export", color: ENERGY_COLORS.export },
  { key: "car", label: "Car", color: ENERGY_COLORS.car },
] as const satisfies ReadonlyArray<{
  key: keyof EnergyChartWidgetOptions;
  label: string;
  color: { top: string; bottom: string; solid: string };
}>;

/** How many trailing buckets to show per period when standalone. */
const BUCKETS: Record<EnergyChartPeriod, number> = { day: 7, week: 8, month: 12 };

const fmtKwh = (v: number): string => (Math.abs(v) >= 100 ? Math.round(v).toString() : v.toFixed(1));

interface ChartModel {
  starts: number[];
  labels: string[];
  values: Record<string, number[]>;
  statPeriod: StatPeriod;
  bucketMs: number;
}

/**
 * Long-range energy chart (entityless composite): a gradient **stacked** bar of
 * solar / import above the axis and export below it, in kWh from the Statistics
 * API, rendered with ECharts for real axes, a "now" line, hover tooltips and
 * legend toggles. Day / Week / Month selector when standalone; on the Energy
 * page it follows the shared page period. Each series id in `options` is a
 * `total_increasing` energy sensor with recorder statistics.
 */
@define("hd-widget-energychart")
export class EnergyChartWidget extends EntityWidget {
  @state() private _period: EnergyChartPeriod = "day";
  @state() private _periodInit = false;
  private readonly _data = new KeyedAsyncController(
    this,
    () => ({} as Record<string, StatBucket[]>),
  );

  private get _opts(): EnergyChartWidgetOptions {
    return this.config.type === "energychart" ? this.config.options ?? {} : {};
  }

  // The chart is periodic history, not live state — don't re-render on every
  // state tick of the underlying meters. But DO recolor when the theme flips.
  protected override relevantEntityIds(): string[] {
    return [];
  }

  protected override shouldUpdate(changed: Map<string, unknown>): boolean {
    if (changed.has("hass")) {
      const prev = changed.get("hass") as HomeAssistant | undefined;
      if (prev?.themes?.darkMode !== this.hass?.themes?.darkMode) return true;
    }
    return super.shouldUpdate(changed);
  }

  protected override hasDetail(): boolean {
    return false;
  }

  private _ids(): string[] {
    return SERIES.map((s) => this._opts[s.key]).filter((v): v is string => typeof v === "string");
  }

  static styles = css`
    .head {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 4px;
    }
    .chart-box {
      flex: 1;
      min-height: 0;
    }
    hd-echart {
      height: 100%;
      min-height: 180px;
    }
  `;

  updated() {
    // Adopt the configured default period once.
    if (!this.energyPeriod && !this._periodInit) {
      this._periodInit = true;
      if (this._opts.defaultPeriod) {
        this._period = this._opts.defaultPeriod;
        return; // the property change re-runs updated()
      }
    }
    this._maybeFetch();
  }

  private _maybeFetch() {
    if (this.energyPeriod) return;
    if (!this.hass?.connected) return;
    const ids = this._ids();
    if (!ids.length) return;
    const key = `${this._period}|${ids.join(",")}`;
    const hass = this.hass;
    const period = this._period;
    this._data.load(key, async () => {
      const start = statisticsRange(period, BUCKETS[period]);
      try {
        return await fetchStatistics(hass, ids, period, start);
      } catch {
        return {};
      }
    });
  }

  private _setPeriod(p: EnergyChartPeriod) {
    if (p !== this._period) this._period = p;
  }

  private _model(): ChartModel {
    const shared = this.energyPeriod;
    const period = shared?.range.selection.period ?? this._period;
    const statPeriod: StatPeriod = shared?.range.statisticPeriod ?? (period === "day" ? "hour" : "day");
    const data = shared?.statistics ?? this._data.value;

    const startSet = new Set<number>();
    for (const s of SERIES) {
      const id = this._opts[s.key];
      if (id) for (const b of data[id] ?? []) startSet.add(b.start);
    }
    const sorted = [...startSet].sort((a, b) => a - b);
    const starts = shared ? sorted : sorted.slice(-BUCKETS[period]);

    const values: Record<string, number[]> = {};
    for (const s of SERIES) {
      const id = this._opts[s.key];
      const byStart = new Map((id ? data[id] ?? [] : []).map((b) => [b.start, b.change]));
      values[s.key] = starts.map((ms) => {
        const v = byStart.get(ms);
        return Number.isFinite(v) ? Math.max(0, v as number) : 0;
      });
    }
    const bucketMs = starts.length > 1
      ? starts[1] - starts[0]
      : statPeriod === "hour" ? 3.6e6 : 864e5;
    const labels = starts.map((ms) => bucketLabel(ms, statPeriod));
    return { starts, labels, values, statPeriod, bucketMs };
  }

  private _headerFor(model: ChartModel, i: number): string {
    const start = model.starts[i];
    if (model.statPeriod === "hour") {
      const t = (ms: number) => new Date(ms).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      return `${t(start)} – ${t(start + model.bucketMs)}`;
    }
    return new Date(start).toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  }

  private _nowIndex(model: ChartModel): number {
    const now = Date.now();
    for (let i = 0; i < model.starts.length; i += 1) {
      if (now >= model.starts[i] && now < model.starts[i] + model.bucketMs) return i;
    }
    return -1;
  }

  private _option(model: ChartModel, theme: ChartTheme): EChartsOption {
    const { labels, values } = model;
    const solar = values.solar;
    const imp = values.gridImport;
    const car = values.car;
    const exp = values.gridExport;
    const total = SERIES.reduce((sum, s) => sum + values[s.key].reduce((a, v) => a + v, 0), 0);
    const stride = Math.max(1, Math.round(labels.length / 6));

    const bar = (
      name: string,
      c: { top: string; bottom: string },
      data: number[],
      above: number[][],
      negative = false,
    ) => ({
      name,
      type: "bar" as const,
      stack: "e",
      barMaxWidth: 26,
      data: negative ? data.map((v) => (v > 0 ? -v : 0)) : data,
      itemStyle: negative
        ? { color: vGradient(c.bottom, c.top) as unknown as string, borderRadius: [0, 0, 6, 6] }
        : { color: vGradient(c.top, c.bottom) as unknown as string, borderRadius: roundedTop(above) },
    });

    return {
      animationDuration: 600,
      animationEasing: "cubicOut",
      textStyle: { fontFamily: theme.font },
      grid: { left: 6, right: 10, top: 34, bottom: 30, containLabel: true },
      graphic: [
        {
          type: "text",
          right: 2,
          top: 2,
          style: {
            text: `${fmtKwh(total)} kWh`,
            fontFamily: theme.font,
            fontSize: 13,
            fontWeight: 700,
            fill: theme.text,
          },
        },
      ],
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow", shadowStyle: { color: theme.dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" } },
        ...tooltipStyle(theme),
        formatter: (params: unknown) => {
          const arr = params as Array<{ dataIndex: number }>;
          const i = arr[0]?.dataIndex ?? 0;
          const rows = SERIES.map((s) => ({ color: s.color.solid, label: s.label, value: `${fmtKwh(values[s.key][i])} kWh` }))
            .filter((r) => parseFloat(r.value) > 0);
          return tooltipHtml(theme, this._headerFor(model, i), rows.length ? rows : [{ color: theme.dim, label: "No energy", value: "0 kWh" }]);
        },
      },
      legend: {
        bottom: 0,
        icon: "roundRect",
        itemWidth: 11,
        itemHeight: 11,
        itemGap: 16,
        textStyle: { color: theme.dim, fontFamily: theme.font, fontSize: 12 },
        inactiveColor: theme.dark ? "#555" : "#c8ccd2",
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: true,
        axisTick: { show: false },
        axisLine: { show: false },
        axisLabel: {
          color: theme.dim,
          fontFamily: theme.font,
          fontSize: 11,
          interval: (idx: number) => idx % stride === 0,
        },
      },
      yAxis: {
        type: "value",
        name: "kWh",
        nameTextStyle: { color: theme.dim, fontFamily: theme.font, fontSize: 11, align: "left", padding: [0, 0, 4, 0] },
        splitLine: { lineStyle: { color: theme.grid } },
        axisLabel: { color: theme.dim, fontFamily: theme.font, fontSize: 11 },
      },
      series: [
        { ...bar("Solar", ENERGY_COLORS.solar, solar, [imp, car]), markLine: nowMarkLine(theme, this._nowIndex(model)) },
        bar("Import", ENERGY_COLORS.import, imp, [car]),
        bar("Car", ENERGY_COLORS.car, car, []),
        bar("Export", ENERGY_COLORS.export, exp, [], true),
      ],
    } as EChartsOption;
  }

  renderContent() {
    const model = this._model();
    const theme = resolveChartTheme(this);
    const hasData = model.starts.length > 0
      && SERIES.some((s) => model.values[s.key].some((v) => v > 0));
    const option = this._option(model, theme);

    return html`
      <hd-widget-frame
        .icon=${"mdi:chart-bar"}
        .name=${this.config.name ?? "Energy history"}
        .size=${this.currentSize}
        .accent=${"accent"}
        .hasDetail=${false}
        .quickKind=${"none"}
      >
        ${this.energyPeriod ? "" : html`<div class="head">
            <hd-segmented
              .options=${[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
              .value=${this._period}
              label="History period"
              @hd-select=${(e: CustomEvent) => this._setPeriod(e.detail.value as EnergyChartPeriod)}
            ></hd-segmented>
          </div>`}
        <div class="chart-box">
          ${hasData
            ? html`<hd-echart .option=${option}></hd-echart>`
            : html`<div style="display:grid;place-items:center;height:100%;color:var(--text-tertiary);font:var(--text-secondary-state)">No data for this period</div>`}
        </div>
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-energychart": EnergyChartWidget;
  }
}
