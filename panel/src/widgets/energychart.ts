import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import {
  bucketLabel,
  fetchStatistics,
  statisticsRange,
  type StatBucket,
  type StatPeriod,
} from "../home-assistant/statistics.js";
import type { BarSeries } from "../primitives/bar-chart.js";
import type { EnergyChartWidgetOptions } from "../config/widget-options.js";
import "./widget-frame.js";
import "../primitives/bar-chart.js";
import "../primitives/segmented.js";
import { KeyedAsyncController } from "../controllers/keyed-async-controller.js";

/** Series definitions in draw order, mapped to option ids at render time. */
const SERIES: Array<{ key: keyof EnergyChartWidgetOptions; label: string; color: string }> = [
  { key: "solar", label: "Solar", color: "#f4b740" },
  { key: "gridImport", label: "Import", color: "var(--accent)" },
  { key: "gridExport", label: "Export", color: "var(--state-eco)" },
  { key: "car", label: "Car", color: "#8b7cf6" },
];

/** How many trailing buckets to show per period. */
const BUCKETS: Record<StatPeriod, number> = { day: 7, week: 8, month: 12 };

/**
 * Long-range energy chart (entityless composite). Grouped bars of solar /
 * import / export / car-charging in kWh from the Statistics API, with a
 * Day / Week / Month selector. Each series id in `options` is a
 * `total_increasing` energy sensor with recorder statistics.
 */
@define("hd-widget-energychart")
export class EnergyChartWidget extends EntityWidget {
  @state() private _period: StatPeriod = "day";
  @state() private _periodInit = false;
  private readonly _data = new KeyedAsyncController(
    this,
    () => ({} as Record<string, StatBucket[]>),
  );

  private get _opts(): EnergyChartWidgetOptions {
    return this.config.type === "energychart" ? this.config.options ?? {} : {};
  }

  // The chart is periodic history, not live state — don't re-render on every
  // state tick of the underlying meters.
  protected override relevantEntityIds(): string[] {
    return [];
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
  `;

  updated() {
    // Adopt the configured default period once.
    if (!this._periodInit) {
      this._periodInit = true;
      if (this._opts.defaultPeriod) {
        this._period = this._opts.defaultPeriod;
        return; // the property change re-runs updated()
      }
    }
    this._maybeFetch();
  }

  private _maybeFetch() {
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

  private _setPeriod(p: StatPeriod) {
    if (p !== this._period) this._period = p;
  }

  private _chart(): { labels: string[]; series: BarSeries[] } {
    const n = BUCKETS[this._period];
    // Union of bucket starts across series, aligned by exact start time.
    const startSet = new Set<number>();
    for (const s of SERIES) {
      const id = this._opts[s.key];
      if (id) for (const b of this._data.value[id] ?? []) startSet.add(b.start);
    }
    const starts = [...startSet].sort((a, b) => a - b).slice(-n);
    const labels = starts.map((ms) => bucketLabel(ms, this._period));
    const series: BarSeries[] = SERIES.filter((s) => this._opts[s.key]).map((s) => {
      const byStart = new Map((this._data.value[this._opts[s.key]!] ?? []).map((b) => [b.start, b.change]));
      return {
        label: s.label,
        color: s.color,
        values: starts.map((ms) => byStart.get(ms) ?? 0),
      };
    });
    return { labels, series };
  }

  renderContent() {
    const { labels, series } = this._chart();
    return html`
      <hd-widget-frame
        .icon=${"mdi:chart-bar"}
        .name=${this.config.name ?? "Energy history"}
        .size=${this.currentSize}
        .accent=${"accent"}
        .hasDetail=${false}
        .quickKind=${"none"}
      >
        <div class="head">
          <hd-segmented
            .options=${[
              { value: "day", label: "Day" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
            .value=${this._period}
            label="History period"
            @hd-select=${(e: CustomEvent) => this._setPeriod(e.detail.value as StatPeriod)}
          ></hd-segmented>
        </div>
        <div class="chart-box">
          <hd-bar-chart .series=${series} .labels=${labels} unit="kWh"></hd-bar-chart>
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
