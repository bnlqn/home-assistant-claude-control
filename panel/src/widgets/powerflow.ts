import { LitElement, css, html, svg, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import type { HomeAssistant } from "../types/hass.js";
import {
  computeFlows,
  isCarActive,
  isCarConnected,
  toWatts,
  type FlowModel,
  type FlowPath,
} from "../home-assistant/energy-flow.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import "./widget-frame.js";
import "../primitives/entity-icon.js";

export interface PowerflowOptions {
  gridPower?: string;
  solarPower?: string;
  houseConsumption?: string;
  carPower?: string;
  carPowerAlt?: string;
  carActive?: string;
  carActiveAlt?: string;
}

/** Build a FlowModel from live hass state + the widget's configured options. */
export function buildFlowModel(hass: HomeAssistant, options: PowerflowOptions): FlowModel {
  const w = (id?: string) => (id ? toWatts(hass.states[id]) : null);
  const grid = w(options.gridPower);
  const solar = w(options.solarPower);

  let car = w(options.carPower);
  if ((car == null || car === 0) && options.carPowerAlt) {
    const alt = w(options.carPowerAlt);
    if (alt != null && alt > 0) car = alt;
  }

  const status = options.carActive ? hass.states[options.carActive]?.state : undefined;
  const statusAlt = options.carActiveAlt ? hass.states[options.carActiveAlt]?.state : undefined;
  const carActive = isCarActive(status) || isCarActive(statusAlt);
  const carConnected = isCarConnected(status) || isCarConnected(statusAlt);

  return computeFlows({ grid, solar, car, carActive, carConnected });
}

function powerText(watts: number): string {
  const abs = Math.abs(watts);
  return abs >= 1000 ? `${formatNumber(abs / 1000)} kW` : `${Math.round(abs)} W`;
}

// Node positions in the 0..100 diagram space (square). House is the hub.
const NODE = {
  house: [50, 50] as const,
  solar: [50, 14] as const,
  grid: [18, 82] as const,
  car: [82, 82] as const,
};

// Trim line endpoints back to the disc edges so dots/arrows don't hide under nodes.
function seg(a: readonly [number, number], b: readonly [number, number], ta: number, tb: number) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a[0] + ux * ta,
    y1: a[1] + uy * ta,
    x2: b[0] - ux * tb,
    y2: b[1] - uy * tb,
  };
}

const HUB_TRIM = 15;
const SAT_TRIM = 13;

/**
 * Self-contained power-flow diagram. Reused by the widget body and the detail
 * surface (both pass a `FlowModel`). Paths animate marching dots in the true
 * flow direction, with a static arrowhead that also serves as the
 * reduced-motion direction cue.
 */
@define("hd-flow-diagram")
export class HdFlowDiagram extends LitElement {
  @property({ attribute: false }) model?: FlowModel;

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 210px;
      container-type: size;
    }
    .status {
      position: absolute;
      top: 12px;
      left: 0;
      right: 0;
      text-align: center;
      font: var(--text-secondary-state);
      font-weight: 600;
      color: var(--text-secondary);
      z-index: 3;
      pointer-events: none;
    }
    .status .val {
      color: var(--flow-status, var(--text-primary));
      font-variant-numeric: tabular-nums;
    }
    svg.paths {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .track {
      fill: none;
      stroke: var(--border-strong);
      stroke-width: 1.5;
      vector-effect: non-scaling-stroke;
    }
    .flow {
      fill: none;
      stroke-linecap: round;
      stroke-dasharray: 0.5 8;
      vector-effect: non-scaling-stroke;
      animation: march 0.9s linear infinite;
    }
    @keyframes march {
      to {
        stroke-dashoffset: -25.5;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .flow {
        animation: none;
        stroke-dasharray: none;
      }
    }
    .arrow {
      vector-effect: non-scaling-stroke;
    }

    .node {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      z-index: 2;
      transition: opacity var(--motion-state) var(--ease-standard);
    }
    .node.idle {
      opacity: 0.5;
    }
    .disc {
      width: clamp(46px, 22cqmin, 68px);
      height: clamp(46px, 22cqmin, 68px);
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--surface);
      color: var(--idle-fg);
      box-shadow: var(--shadow-widget);
      border: 1.5px solid var(--border-subtle);
      transition: background var(--motion-state) var(--ease-standard),
        color var(--motion-state) var(--ease-standard), border-color var(--motion-state) var(--ease-standard);
    }
    .node.active .disc {
      background: var(--n-bg, var(--accent-soft));
      color: var(--n-fg, var(--accent-text));
      border-color: color-mix(in srgb, var(--n-fg, var(--accent)) 40%, transparent);
    }
    .node.hub .disc {
      background: var(--surface-inverse);
      color: var(--canvas);
      border: none;
    }
    .label {
      font: var(--text-secondary-state);
      font-weight: 700;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .name {
      font: var(--text-meta);
      color: var(--text-tertiary);
      line-height: 1;
    }
    .node.idle .label {
      color: var(--text-tertiary);
    }
  `;

  private _pathColor(p: FlowPath): string {
    if (!p.active) return "var(--border-strong)";
    return p.source === "solar" ? "var(--state-eco)" : "var(--accent)";
  }

  private _pathWidth(p: FlowPath): number {
    const kw = p.watts / 1000;
    return Math.min(5, Math.max(2.5, 2 + kw * 0.9));
  }

  /** Render one connecting path: base track + (if active) a directional flow line + arrowhead. */
  private _renderPath(
    from: readonly [number, number],
    to: readonly [number, number],
    path: FlowPath,
    reversed: boolean,
  ) {
    // Order endpoints along the true flow direction so dots + arrowhead point right.
    const a = reversed ? to : from;
    const b = reversed ? from : to;
    const line = seg(a, b, a === NODE.house ? HUB_TRIM : SAT_TRIM, b === NODE.house ? HUB_TRIM : SAT_TRIM);
    const track = seg(from, to, from === NODE.house ? HUB_TRIM : SAT_TRIM, to === NODE.house ? HUB_TRIM : SAT_TRIM);
    const color = this._pathColor(path);
    const width = this._pathWidth(path);
    // Arrowhead near the destination end.
    const ux = line.x2 - line.x1;
    const uy = line.y2 - line.y1;
    const len = Math.hypot(ux, uy) || 1;
    const nx = ux / len;
    const ny = uy / len;
    const tipX = line.x2 - nx * 2;
    const tipY = line.y2 - ny * 2;
    const size = 3.4;
    const backX = tipX - nx * size;
    const backY = tipY - ny * size;
    const perpX = -ny * size * 0.62;
    const perpY = nx * size * 0.62;
    const arrow = `${tipX},${tipY} ${backX + perpX},${backY + perpY} ${backX - perpX},${backY - perpY}`;

    return svg`
      <line class="track" x1=${track.x1} y1=${track.y1} x2=${track.x2} y2=${track.y2}></line>
      ${
        path.active
          ? svg`
        <line class="flow" x1=${line.x1} y1=${line.y1} x2=${line.x2} y2=${line.y2}
          style=${`stroke:${color};stroke-width:${width}`}></line>
        <polygon class="arrow" points=${arrow} style=${`fill:${color}`}></polygon>`
          : nothing
      }
    `;
  }

  private _node(
    key: "house" | "solar" | "grid" | "car",
    icon: string,
    name: string,
    node: { watts: number; active: boolean },
    tint: { bg: string; fg: string },
  ) {
    const [x, y] = NODE[key];
    const isHub = key === "house";
    const cls = `node ${isHub ? "hub" : node.active ? "active" : "idle"}`;
    const vars = isHub ? "" : `--n-bg:${tint.bg};--n-fg:${tint.fg}`;
    return html`<div class="${cls}" style=${`left:${x}%;top:${y}%;${vars}`}>
      <div class="disc"><hd-icon .icon=${icon} .size=${24}></hd-icon></div>
      <div class="label">${powerText(node.watts)}</div>
      <div class="name">${name}</div>
    </div>`;
  }

  render() {
    const m = this.model;
    if (!m) return nothing;
    const statusColor =
      m.grid.mode === "export" ? "var(--state-eco)" : m.grid.mode === "import" ? "var(--accent-text)" : "var(--text-secondary)";
    const statusText =
      m.grid.mode === "export"
        ? `Exporting ${powerText(m.grid.watts)}`
        : m.grid.mode === "import"
          ? `Importing ${powerText(m.grid.watts)}`
          : "Grid balanced";

    return html`
      <div class="status">
        <span class="val" style=${`--flow-status:${statusColor}`}>${statusText}</span>
      </div>
      <svg class="paths" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${this._renderPath(NODE.solar, NODE.house, m.paths.solarHouse, false)}
        ${this._renderPath(NODE.grid, NODE.house, m.paths.gridHouse, m.grid.mode === "export")}
        ${this._renderPath(NODE.house, NODE.car, m.paths.houseCar, false)}
      </svg>
      ${this._node("solar", "mdi:solar-power", "Solar", m.solar, {
        bg: "var(--state-eco-soft)",
        fg: "var(--state-eco)",
      })}
      ${this._node(
        "grid",
        m.grid.mode === "export" ? "mdi:transmission-tower-export" : "mdi:transmission-tower",
        m.grid.mode === "export" ? "Export" : "Grid",
        m.grid,
        m.grid.mode === "export"
          ? { bg: "var(--state-eco-soft)", fg: "var(--state-eco)" }
          : { bg: "var(--accent-soft)", fg: "var(--accent-text)" },
      )}
      ${this._node(
        "car",
        m.car.connected ? "mdi:car-electric" : "mdi:car-electric-outline",
        "Car",
        m.car,
        // Match the incoming path: green when charging on solar, blue on grid.
        m.paths.houseCar.source === "solar"
          ? { bg: "var(--state-eco-soft)", fg: "var(--state-eco)" }
          : { bg: "var(--accent-soft)", fg: "var(--accent-text)" },
      )}
      ${this._node("house", "mdi:home-variant", "House", m.house, {
        bg: "var(--surface-inverse)",
        fg: "var(--canvas)",
      })}
    `;
  }
}

/**
 * Power-flow widget (entityless — reads sensors from `options`). A live
 * Grid ↔ Solar ↔ House ↔ Car diagram. Full-bleed interior; tapping opens a
 * larger diagram + 24 h grid trend in the detail surface.
 */
@define("hd-widget-powerflow")
export class PowerflowWidget extends EntityWidget {
  private get _opts(): PowerflowOptions {
    return (this.config.options ?? {}) as PowerflowOptions;
  }

  protected override relevantEntityIds(): string[] {
    return Object.values(this._opts).filter((v): v is string => typeof v === "string");
  }

  protected override hasDetail(): boolean {
    return true;
  }

  render(): TemplateResult {
    const model = this.hass ? buildFlowModel(this.hass, this._opts) : undefined;
    const accent = model?.grid.mode === "export" ? "eco" : "accent";
    return html`
      <hd-widget-frame
        bleed
        .name=${this.config.name ?? "Power flow"}
        .size=${this.currentSize}
        .accent=${accent}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <hd-flow-diagram .model=${model}></hd-flow-diagram>
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-flow-diagram": HdFlowDiagram;
    "hd-widget-powerflow": PowerflowWidget;
  }
}
