import { LitElement, css, html, svg, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";
import "./entity-icon.js";

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

/**
 * Tiny sparkline/area trend chart used in sensor & energy details. Renders an
 * SVG polyline; carries a textual summary in aria-label for screen readers.
 */
@define("hd-trend")
export class HdTrend extends LitElement {
  @property({ attribute: false }) points: number[] = [];
  @property({ type: String }) color = "var(--accent)";
  @property({ type: Boolean }) area = true;
  @property({ type: String }) summary = "";
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .line {
      fill: none;
      stroke: var(--trend-color, var(--accent));
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .fill {
      fill: var(--trend-color, var(--accent));
      opacity: 0.14;
    }
  `;
  render() {
    const pts = this.points.filter((n) => Number.isFinite(n));
    if (pts.length < 2) {
      return html`<svg viewBox="0 0 100 32" preserveAspectRatio="none" aria-label=${this.summary}></svg>`;
    }
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const span = max - min || 1;
    const W = 100;
    const H = 32;
    const step = W / (pts.length - 1);
    const coords = pts.map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / span) * (H - 4) - 2;
      return [x, y] as const;
    });
    const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    const areaPath = `${line} L${W},${H} L0,${H} Z`;
    return html`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label=${this.summary}
      style=${`--trend-color:${this.color}`}
      >${this.area ? svg`<path class="fill" d=${areaPath}></path>` : nothing}
      ${svg`<path class="line" d=${line}></path>`}</svg
    >`;
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
