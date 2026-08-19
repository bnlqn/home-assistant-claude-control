import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";

/** One series of the grouped bar chart, aligned with the chart's `labels`. */
export interface BarSeries {
  label: string;
  color: string;
  values: number[];
}

const niceCeil = (v: number): number => {
  if (v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return step * mag;
};

const fmt = (v: number): string => (Math.abs(v) >= 100 ? Math.round(v).toString() : v.toFixed(1));

/**
 * A responsive grouped bar chart (CSS flex, not SVG — so it scales cleanly and
 * labels stay crisp). One group per x-label, one bar per series in each group,
 * a legend with per-series totals, and a "nice" y-max caption. Presentational
 * and dependency-free of the Home Assistant layer.
 */
@define("hd-bar-chart")
export class HdBarChart extends LitElement {
  @property({ attribute: false }) series: BarSeries[] = [];
  @property({ attribute: false }) labels: string[] = [];
  @property({ type: String }) unit = "";
  @property({ type: Boolean }) legend = true;

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .wrap {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 8px;
    }
    .plot {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: stretch;
      gap: 1.5%;
      padding-top: 14px;
    }
    .ymax {
      position: absolute;
      top: 0;
      right: 0;
      font: var(--text-meta);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }
    .group {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
    }
    .bars {
      flex: 1;
      min-height: 0;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 2px;
      border-bottom: 1px solid var(--hairline, rgba(128, 128, 128, 0.22));
    }
    .bar {
      flex: 1;
      max-width: 16px;
      border-radius: 3px 3px 0 0;
      background: var(--c, var(--accent));
      transition: height var(--motion-state, 0.3s) var(--ease-standard, ease);
    }
    .xlabel {
      margin-top: 5px;
      text-align: center;
      font: var(--text-meta);
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
    }
    .key {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font: var(--text-meta);
      color: var(--text-secondary);
    }
    .key i {
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background: var(--c);
      flex: none;
    }
    .key b {
      color: var(--text-primary);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .empty {
      display: grid;
      place-items: center;
      height: 100%;
      color: var(--text-tertiary);
      font: var(--text-secondary-state);
    }
  `;

  private _total(s: BarSeries): number {
    return s.values.reduce((a, v) => a + (Number.isFinite(v) ? v : 0), 0);
  }

  render() {
    const n = this.labels.length;
    const series = this.series.filter((s) => s.values.some((v) => v > 0));
    const max = Math.max(0, ...this.series.flatMap((s) => s.values.filter((v) => Number.isFinite(v))));

    if (!n || !series.length || max <= 0) {
      return html`<div class="empty">No data for this period</div>`;
    }
    const top = niceCeil(max);

    const summary = series.map((s) => `${s.label} ${fmt(this._total(s))} ${this.unit}`).join(", ");

    return html`
      <div class="wrap" role="img" aria-label=${summary}>
        <div class="plot">
          <span class="ymax">${fmt(top)} ${this.unit}</span>
          ${this.labels.map(
            (lab, i) => html`<div class="group">
              <div class="bars">
                ${this.series.map((s) => {
                  const v = Number.isFinite(s.values[i]) ? s.values[i] : 0;
                  const h = v <= 0 ? 0 : Math.max(1.5, (v / top) * 100);
                  return html`<div
                    class="bar"
                    style=${`--c:${s.color};height:${h}%`}
                    title=${`${s.label}: ${fmt(v)} ${this.unit}`}
                  ></div>`;
                })}
              </div>
              <div class="xlabel">${lab}</div>
            </div>`,
          )}
        </div>
        ${this.legend
          ? html`<div class="legend">
              ${this.series.map(
                (s) => html`<span class="key" style=${`--c:${s.color}`}>
                  <i></i>${s.label} <b>${fmt(this._total(s))} ${this.unit}</b>
                </span>`,
              )}
            </div>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-bar-chart": HdBarChart;
  }
}
