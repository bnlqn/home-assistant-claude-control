import { css, html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { fetchNumericHistory, type HistoryPoint } from "../home-assistant/history.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import { KeyedAsyncController } from "../controllers/keyed-async-controller.js";
import type { SolarForecastWidgetOptions } from "../config/widget-options.js";
import type { HomeAssistant } from "../types/hass.js";
import type { EChartsOption } from "../primitives/echart.js";
import {
  ENERGY_COLORS,
  nowMarkLine,
  resolveChartTheme,
  tooltipHtml,
  tooltipStyle,
  vGradient,
  type ChartTheme,
} from "../energy/chart-style.js";
import "../primitives/entity-icon.js";
import "../primitives/echart.js";

export interface Point {
  /** Fraction of the local day, 0 (midnight) … 1 (next midnight). */
  x: number;
  /** Watts. */
  w: number;
}

interface ForecastAttrPoint {
  datetime?: string;
  watts?: number | string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local midnight (start of today) for the browser's timezone. */
export function startOfLocalDay(now = new Date()): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * Parse a `forecast` attribute (`[{ datetime, watts }]`) into today's expected
 * production curve, as day-fraction points sorted by time. Pure + defensive:
 * ignores malformed rows and anything outside the local day.
 */
export function forecastCurve(raw: unknown, dayStart: number): Point[] {
  if (!Array.isArray(raw)) return [];
  const points: Point[] = [];
  for (const entry of raw as ForecastAttrPoint[]) {
    const t = entry?.datetime ? Date.parse(entry.datetime) : NaN;
    const w = Number(entry?.watts);
    if (!Number.isFinite(t) || !Number.isFinite(w)) continue;
    const x = (t - dayStart) / DAY_MS;
    if (x < 0 || x > 1) continue;
    points.push({ x, w });
  }
  return points.sort((a, b) => a.x - b.x);
}

/**
 * Today's actual production curve from recorder history, with the current live
 * reading appended so the trace reaches `now` between recorder samples.
 */
export function actualCurve(
  history: ReadonlyArray<{ t: number; value: number }>,
  liveWatts: number | null,
  dayStart: number,
  now: number,
): Point[] {
  const points: Point[] = history.map((p) => ({ x: (p.t - dayStart) / DAY_MS, w: p.value }));
  if (liveWatts != null) {
    const nowX = (now - dayStart) / DAY_MS;
    if (!points.length || nowX - points[points.length - 1].x > 0.001) {
      points.push({ x: nowX, w: liveWatts });
    }
  }
  return points.filter((p) => p.x >= 0 && p.x <= 1);
}

/**
 * Solar-forecast widget: overlays the day's **expected** production curve
 * (from a `forecast` attribute of quarter-hourly `{ datetime, watts }`) with the
 * **actual** PV curve traced to `now`, plus a live "now" marker and a headline
 * of energy produced so far vs. still to come. Entityless — every source comes
 * from `options`; it degrades to whichever pieces are configured/available.
 */
@define("hd-widget-solarforecast")
export class SolarForecastWidget extends EntityWidget {
  @state() private _actual: HistoryPoint[] = [];

  private readonly _history = new KeyedAsyncController<HistoryPoint[]>(this, () => []);
  private _timer = 0;

  private get _opts(): SolarForecastWidgetOptions {
    return this.config.type === "solarforecast" ? this.config.options ?? {} : {};
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Actual history is recorder-backed; a light refresh keeps the curve current
    // without leaning on every live power tick.
    this._timer = window.setInterval(() => this._loadActual(true), 5 * 60 * 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }

  updated(): void {
    this._loadActual(false);
    if (this._history.value !== this._actual) this._actual = this._history.value;
  }

  private _loadActual(force: boolean): void {
    const id = this._opts.actualPower;
    if (!id || !this.hass?.connected) return;
    const key = `${id}:${startOfLocalDay()}`;
    const hass = this.hass;
    this._history.load(
      key,
      async () => {
        const rows = await fetchNumericHistory(hass, id, 24);
        const dayStart = startOfLocalDay();
        return rows.filter((p) => p.t >= dayStart);
      },
      force,
    );
  }

  protected override shouldUpdate(changed: Map<string, unknown>): boolean {
    if (changed.has("hass")) {
      const prev = changed.get("hass") as HomeAssistant | undefined;
      if (prev?.themes?.darkMode !== this.hass?.themes?.darkMode) return true;
    }
    return super.shouldUpdate(changed);
  }

  private _num(id?: string): number | null {
    if (!id) return null;
    const value = Number(this.hass?.states[id]?.state);
    return Number.isFinite(value) ? value : null;
  }

  /** The forecast curve for today, as day-fraction points. */
  private _forecastPoints(): Point[] {
    const id = this._opts.forecastPower;
    const raw = id ? this.hass?.states[id]?.attributes?.forecast : undefined;
    return forecastCurve(raw, startOfLocalDay());
  }

  /** The actual curve for today, with the current live reading appended. */
  private _actualPoints(): Point[] {
    return actualCurve(this._actual, this._num(this._opts.actualPower), startOfLocalDay(), Date.now());
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      box-sizing: border-box;
      height: 100%;
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: 18px 20px 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
    }
    .head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .title {
      margin: 0;
      font: var(--text-widget-title);
      font-weight: 700;
      color: var(--text-primary);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .title hd-icon {
      color: #f5a623;
    }
    .headline {
      display: flex;
      align-items: baseline;
      gap: 6px;
      font-variant-numeric: tabular-nums;
    }
    .headline b {
      font: 700 clamp(22px, 6vw, 30px) / 1 var(--font-sans);
      color: var(--text-primary);
    }
    .headline .u {
      font: var(--text-secondary-state);
      color: var(--text-tertiary);
    }
    .togo {
      font: var(--text-meta);
      color: var(--text-secondary);
    }
    .chart {
      position: relative;
      flex: 1;
      min-height: 120px;
    }
    hd-echart {
      height: 100%;
    }
    .empty {
      display: grid;
      place-items: center;
      height: 100%;
      color: var(--text-tertiary);
      font: var(--text-meta);
    }
  `;

  /** Actual (area) + forecast (dashed line) solar power over today, in kW. */
  private _option(theme: ChartTheme): EChartsOption {
    const dayStart = startOfLocalDay();
    const toKw = (p: Point): [number, number] => [
      Number((p.x * 24).toFixed(3)),
      Number((p.w / 1000).toFixed(3)),
    ];
    const forecast = this._forecastPoints().map(toKw);
    const actual = this._actualPoints().map(toKw);
    const nowHour = ((Date.now() - dayStart) / DAY_MS) * 24;
    // Cool slate for the forecast (a "prediction") so it reads clearly against
    // the warm amber of actual production — not two shades of the same hue.
    const forecastColor = theme.dark ? "#9DB2CE" : "#8595AD";
    const solar = ENERGY_COLORS.solar.solid;
    const timeAt = (h: number) =>
      new Date(dayStart + h * 3.6e6).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

    return {
      animationDuration: 600,
      animationEasing: "cubicOut",
      textStyle: { fontFamily: theme.font },
      grid: { left: 4, right: 12, top: 14, bottom: 26, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: theme.grid, width: 1 } },
        ...tooltipStyle(theme),
        formatter: (params: unknown) => {
          const arr = params as Array<{ seriesName: string; value: [number, number]; axisValue: number }>;
          const rows = arr.map((p) => ({
            color: p.seriesName === "Forecast" ? forecastColor : solar,
            label: p.seriesName,
            value: `${(p.value?.[1] ?? 0).toFixed(2)} kW`,
          }));
          return tooltipHtml(theme, timeAt(arr[0]?.axisValue ?? nowHour), rows);
        },
      },
      legend: {
        bottom: 0,
        icon: "roundRect",
        itemWidth: 11,
        itemHeight: 11,
        itemGap: 16,
        textStyle: { color: theme.dim, fontFamily: theme.font, fontSize: 12 },
      },
      xAxis: {
        type: "value",
        min: 0,
        max: 24,
        interval: 6,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: theme.dim,
          fontFamily: theme.font,
          fontSize: 11,
          formatter: (v: number) => String(v).padStart(2, "0"),
        },
      },
      yAxis: {
        type: "value",
        name: "kW",
        min: 0,
        nameTextStyle: { color: theme.dim, fontFamily: theme.font, fontSize: 11, align: "left", padding: [0, 0, 4, 0] },
        splitLine: { lineStyle: { color: theme.grid } },
        axisLabel: { color: theme.dim, fontFamily: theme.font, fontSize: 11 },
      },
      series: [
        {
          name: "Forecast",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: forecast,
          color: forecastColor,
          lineStyle: { color: forecastColor, width: 2, type: [5, 4] },
          itemStyle: { color: forecastColor },
          z: 1,
        },
        {
          name: "Produced",
          type: "line",
          smooth: true,
          showSymbol: false,
          data: actual,
          color: solar,
          lineStyle: { color: solar, width: 2.5 },
          itemStyle: { color: solar },
          areaStyle: {
            color: vGradient(
              theme.dark ? "rgba(245,166,35,0.42)" : "rgba(245,166,35,0.34)",
              "rgba(245,166,35,0.02)",
            ) as unknown as string,
          },
          markLine: nowMarkLine(theme, nowHour),
          z: 2,
        },
      ],
    } as EChartsOption;
  }

  renderContent(): TemplateResult {
    const produced = this._num(this._opts.producedToday);
    const remaining = this._num(this._opts.remaining);
    const forecastTotal = this._num(this._opts.forecastTotal);
    const hasCurve = this._forecastPoints().length > 1 || this._actualPoints().length > 1;
    const theme = resolveChartTheme(this);

    return html`
      <div class="card">
        <div class="head">
          <h2 class="title">
            <hd-icon icon="mdi:weather-sunny" .size=${20}></hd-icon>
            ${this.config.name ?? "Solar forecast"}
          </h2>
          ${produced != null
            ? html`<span class="headline"
                ><b>${formatNumber(produced)}</b><span class="u">kWh today</span></span
              >`
            : forecastTotal != null
              ? html`<span class="headline"
                  ><b>${formatNumber(forecastTotal)}</b><span class="u">kWh forecast</span></span
                >`
              : nothing}
        </div>

        ${remaining != null && remaining > 0.05
          ? html`<div class="togo">
              ${formatNumber(remaining)} kWh still to come${forecastTotal != null
                ? ` · ${formatNumber(forecastTotal)} kWh forecast today`
                : ""}
            </div>`
          : forecastTotal != null && produced != null
            ? html`<div class="togo">${formatNumber(forecastTotal)} kWh forecast today</div>`
            : nothing}

        <div class="chart">
          ${hasCurve
            ? html`<hd-echart .option=${this._option(theme)}></hd-echart>`
            : html`<div class="empty">No forecast data</div>`}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-solarforecast": SolarForecastWidget;
  }
}
