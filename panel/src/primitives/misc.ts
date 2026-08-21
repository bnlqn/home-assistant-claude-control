import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";
import { graphic, type EChartsOption } from "./echart.js";
import { resolveChartTheme, tooltipHtml, tooltipStyle } from "../energy/chart-style.js";
import "./echart.js";
import "./entity-icon.js";

/** Resolve a color expression (`var(--x)` or a literal) against a host element. */
function resolveColor(host: Element, value: string): string {
  const v = value.trim();
  if (v.startsWith("var(")) {
    const name = v.slice(4, v.lastIndexOf(")")).split(",")[0].trim();
    return getComputedStyle(host).getPropertyValue(name).trim() || "#3b82f6";
  }
  return v || "#3b82f6";
}

/** Turn a hex or rgb color into an `rgba()` string at the given alpha. */
function withAlpha(color: string, alpha: number): string {
  const c = color.trim();
  if (c.startsWith("#")) {
    const h = c.slice(1);
    const to = (s: string): number => parseInt(s, 16);
    let r = 0;
    let g = 0;
    let b = 0;
    if (h.length === 3) {
      [r, g, b] = [to(h[0] + h[0]), to(h[1] + h[1]), to(h[2] + h[2])];
    } else if (h.length >= 6) {
      [r, g, b] = [to(h.slice(0, 2)), to(h.slice(2, 4)), to(h.slice(4, 6))];
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const m = c.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? `rgba(${m[1]},${m[2]},${m[3]},${alpha})` : c;
}

/** Thin progress/level bar (cover position, volume readout, battery). */
@define("hd-progress")
export class HdProgress extends LitElement {
  @property({ type: Number }) value = 0; // 0..100
  @property({ type: String }) color = "var(--accent)";
  @property({ type: String }) label = "";
  static styles = css`
    :host {
      display: block;
    }
    .rail {
      height: 8px;
      border-radius: var(--radius-pill);
      background: var(--surface-sunken);
      overflow: hidden;
    }
    .bar {
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--bar-color, var(--accent));
      transition: width var(--motion-state) var(--ease-standard);
    }
  `;
  render() {
    const v = Math.min(100, Math.max(0, this.value));
    return html`<div
      class="rail"
      role="progressbar"
      aria-label=${this.label}
      aria-valuenow=${Math.round(v)}
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="bar" style=${`width:${v}%;--bar-color:${this.color}`}></div>
    </div>`;
  }
}

/** A compact stat pill: icon + label + value tone. */
@define("hd-status-badge")
export class HdStatusBadge extends LitElement {
  @property({ type: String }) icon = "";
  @property({ type: String }) text = "";
  @property({ type: String }) tone: "neutral" | "eco" | "warn" | "alert" | "accent" = "neutral";
  static styles = css`
    :host {
      display: inline-flex;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 9px;
      border-radius: var(--radius-pill);
      font: var(--text-meta);
      font-weight: 600;
      background: var(--idle-bg);
      color: var(--text-secondary);
      max-width: 100%;
    }
    .badge span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    :host([tone="eco"]) .badge {
      background: var(--state-eco-soft);
      color: var(--state-eco);
    }
    :host([tone="warn"]) .badge {
      background: var(--state-warn-soft);
      color: var(--state-warn);
    }
    :host([tone="alert"]) .badge {
      background: var(--state-alert-soft);
      color: var(--state-alert);
    }
    :host([tone="accent"]) .badge {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
  `;
  render() {
    return html`<span class="badge"
      >${this.icon ? html`<hd-icon .icon=${this.icon} .size=${14}></hd-icon>` : nothing}
      ${this.text ? html`<span>${this.text}</span>` : nothing}</span
    >`;
  }
}

/** Loading skeleton block with a reduced-motion-safe shimmer. */
@define("hd-skeleton")
export class HdSkeleton extends LitElement {
  @property({ type: String }) w = "100%";
  @property({ type: String }) h = "16px";
  @property({ type: String }) radius = "8px";
  static styles = css`
    :host {
      display: block;
    }
    .sk {
      width: var(--w);
      height: var(--h);
      border-radius: var(--r);
      background: linear-gradient(
        100deg,
        var(--surface-subtle) 30%,
        var(--surface-hover) 50%,
        var(--surface-subtle) 70%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }
    @keyframes shimmer {
      to {
        background-position: -200% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .sk {
        animation: none;
        background: var(--surface-subtle);
      }
    }
  `;
  render() {
    return html`<div class="sk" style=${`--w:${this.w};--h:${this.h};--r:${this.radius}`}></div>`;
  }
}

/** Format a value with up to a couple of decimals plus an optional unit. */
function fmtValue(v: number, unit: string): string {
  const abs = Math.abs(v);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  let s: string;
  try {
    s = new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(v);
  } catch {
    s = v.toFixed(digits);
  }
  return unit ? `${s} ${unit}` : s;
}

/** Short local clock label (e.g. "14:30") for a trend's time axis / tooltip. */
function fmtTime(ms: number): string {
  return new Date(ms).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/**
 * Trend chart used in sensor & energy widgets and detail dialogs. Renders an
 * ECharts canvas (same engine as the panel's full charts) so every graph shares
 * one rendering path and visual language.
 *
 * Two densities from one component:
 *  - **compact** (default) — a bare sparkline for tiny widget tiles: a smooth
 *    line over a soft gradient, no axes, meant as a glanceable shape beside the
 *    tile's big current value.
 *  - **`detailed`** — a readable chart for the detail dialog: a value axis with
 *    the unit, a time axis, gridlines, and a hover tooltip showing the exact
 *    value at a point in time. Pass `times` (epoch-ms per point) and `unit`.
 *
 * `summary` is exposed to assistive tech via the host's `aria-label`.
 */
@define("hd-trend")
export class HdTrend extends LitElement {
  @property({ attribute: false }) points: number[] = [];
  /** Optional epoch-ms timestamp per point; enables a real time axis + tooltip. */
  @property({ attribute: false }) times: number[] = [];
  @property({ type: String }) color = "var(--accent)";
  @property({ type: Boolean }) area = true;
  /** Render axes + hover tooltip (detail dialog) instead of a bare sparkline. */
  @property({ type: Boolean }) detailed = false;
  @property({ type: String }) unit = "";
  @property({ type: String }) summary = "";
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    hd-echart {
      width: 100%;
      height: 100%;
    }
    .empty {
      width: 100%;
      height: 100%;
    }
  `;

  private _areaStyle(color: string): object {
    return {
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: withAlpha(color, this.detailed ? 0.32 : 0.28) },
        { offset: 1, color: withAlpha(color, 0.02) },
      ]) as unknown as string,
    };
  }

  /** Bare sparkline for tiny tiles — no axes, no interaction. */
  private _compactOption(pts: number[], color: string): EChartsOption {
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const pad = (max - min) * 0.12 || 1;
    return {
      animationDuration: 500,
      animationEasing: "cubicOut",
      grid: { left: 1, right: 1, top: 4, bottom: 3 },
      xAxis: { type: "category", show: false, boundaryGap: false, data: pts.map((_, i) => i) },
      yAxis: { type: "value", show: false, min: min - pad, max: max + pad },
      series: [
        {
          type: "line",
          data: pts,
          smooth: 0.35,
          showSymbol: false,
          silent: true,
          lineStyle: { color, width: 2.5, cap: "round", join: "round" },
          ...(this.area ? { areaStyle: this._areaStyle(color) } : {}),
          z: 2,
        },
      ],
    } as EChartsOption;
  }

  /** Readable, axed chart with a hover tooltip for the detail dialog. */
  private _detailedOption(pts: number[], color: string): EChartsOption {
    const theme = resolveChartTheme(this);
    const hasTimes = this.times.length === pts.length && pts.length > 1;
    const data: Array<[number, number] | number> = hasTimes
      ? pts.map((v, i) => [this.times[i], v] as [number, number])
      : pts;
    return {
      animationDuration: 600,
      animationEasing: "cubicOut",
      textStyle: { fontFamily: theme.font },
      grid: { left: 4, right: 12, top: 12, bottom: 4, containLabel: true },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "line", lineStyle: { color: theme.grid, width: 1 } },
        ...tooltipStyle(theme),
        formatter: (params: unknown) => {
          const arr = params as Array<{ value: [number, number] | number; axisValue: number }>;
          const p = arr[0];
          const val = Array.isArray(p?.value) ? p.value[1] : (p?.value as number);
          const header = hasTimes ? fmtTime(Array.isArray(p.value) ? p.value[0] : p.axisValue) : "";
          return tooltipHtml(theme, header, [
            { color, label: "", value: fmtValue(val ?? 0, this.unit) },
          ]);
        },
      },
      xAxis: {
        type: hasTimes ? "time" : "category",
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        axisLabel: {
          color: theme.dim,
          fontFamily: theme.font,
          fontSize: 11,
          hideOverlap: true,
          formatter: hasTimes ? (v: number) => fmtTime(v) : undefined,
        },
        ...(hasTimes ? {} : { data: pts.map((_, i) => i), show: false }),
      },
      yAxis: {
        type: "value",
        scale: true,
        splitNumber: 3,
        splitLine: { lineStyle: { color: theme.grid } },
        // Unit is carried by the tooltip + the dialog's meta row, so the axis
        // stays clutter-free with bare numbers (no overlapping unit label).
        axisLabel: {
          color: theme.dim,
          fontFamily: theme.font,
          fontSize: 11,
          formatter: (v: number) => fmtValue(v, ""),
        },
      },
      series: [
        {
          type: "line",
          data,
          smooth: 0.3,
          showSymbol: false,
          lineStyle: { color, width: 2.5, cap: "round", join: "round" },
          itemStyle: { color },
          ...(this.area ? { areaStyle: this._areaStyle(color) } : {}),
          z: 2,
        },
      ],
    } as EChartsOption;
  }

  private _option(): EChartsOption {
    const pts = this.points.filter((n) => Number.isFinite(n));
    const color = resolveColor(this, this.color);
    return this.detailed ? this._detailedOption(pts, color) : this._compactOption(pts, color);
  }

  updated(): void {
    this.setAttribute("role", "img");
    if (this.summary) this.setAttribute("aria-label", this.summary);
  }

  render() {
    const pts = this.points.filter((n) => Number.isFinite(n));
    if (pts.length < 2) return html`<div class="empty"></div>`;
    return html`<hd-echart .option=${this._option()}></hd-echart>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-progress": HdProgress;
    "hd-status-badge": HdStatusBadge;
    "hd-skeleton": HdSkeleton;
    "hd-trend": HdTrend;
  }
}
