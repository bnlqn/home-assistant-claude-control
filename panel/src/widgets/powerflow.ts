import { LitElement, css, html, svg, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import type { HomeAssistant } from "../types/hass.js";
import type { PowerflowWidgetOptions } from "../config/widget-options.js";
import {
  FLOW_DEADBAND_W,
  computeFlows,
  isCarActive,
  isCarConnected,
  toWatts,
  type FlowModel,
} from "../home-assistant/energy-flow.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import "./widget-frame.js";
import "../primitives/entity-icon.js";

export type PowerflowOptions = PowerflowWidgetOptions;

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

// ---- Diagram geometry (0..100 square space) ------------------------------
// Sources across the top, House the dominant centre, loads below.
type Pt = readonly [number, number];
const N: Record<"grid" | "solar" | "house" | "car", Pt> = {
  grid: [25, 26],
  solar: [75, 26],
  house: [50, 50],
  car: [50, 80],
};
// Grid/Solar controls sit near the chord to the hub so each source flow exits
// the disc's inner edge and travels *beside* the value label (which sits
// directly below the disc) instead of straight down through it. The car control
// bows the House→Car connector right to clear the House value + "% solar" caption.
const CTRL = { grid: [40, 40] as Pt, solar: [60, 40] as Pt, car: [67, 64] as Pt };
// Trim radii ≈ the disc radii in this 0..100 space, so arrow/flow ends land on
// the disc edge rather than floating out into the label.
const SAT_R = 10;
const HUB_R = 13;

function unit(dx: number, dy: number): [number, number] {
  const l = Math.hypot(dx, dy) || 1;
  return [dx / l, dy / l];
}

/** A quadratic curve from `start` to `end` (bowed through `control`), trimmed to disc edges, plus a direction chevron at the end. */
function curve(start: Pt, control: Pt, end: Pt, rStart: number, rEnd: number) {
  const [uax, uay] = unit(control[0] - start[0], control[1] - start[1]);
  const s: [number, number] = [start[0] + uax * rStart, start[1] + uay * rStart];
  const [ubx, uby] = unit(control[0] - end[0], control[1] - end[1]);
  const e: [number, number] = [end[0] + ubx * rEnd, end[1] + uby * rEnd];
  const d = `M ${s[0].toFixed(2)} ${s[1].toFixed(2)} Q ${control[0]} ${control[1]} ${e[0].toFixed(2)} ${e[1].toFixed(2)}`;
  const [tx, ty] = unit(e[0] - control[0], e[1] - control[1]); // travel direction at end
  const sz = 3.1;
  const back: [number, number] = [e[0] - tx * sz, e[1] - ty * sz];
  const px = -ty * sz * 0.6;
  const py = tx * sz * 0.6;
  const chevron = `${e[0].toFixed(2)},${e[1].toFixed(2)} ${(back[0] + px).toFixed(2)},${(back[1] + py).toFixed(2)} ${(back[0] - px).toFixed(2)},${(back[1] - py).toFixed(2)}`;
  return { d, chevron };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Self-contained, polished power-flow diagram. Sources top, House centre, Car
 * below; curved luminous flows over faint idle tracks; crisp ring-and-icon
 * nodes; tweened numbers. Reused by the widget body and the detail surface.
 */
@define("hd-flow-diagram")
export class HdFlowDiagram extends LitElement {
  @property({ attribute: false }) model?: FlowModel;

  // Tweened display watts for smooth number transitions.
  @state() private _shown = { grid: 0, solar: 0, house: 0, car: 0 };
  private _raf = 0;

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 210px;
    }
    /* inset (not host padding): an absolutely-positioned child ignores host
       padding, so inset the centered square directly to get card breathing room
       around the pill and nodes while keeping the square lock. */
    .stage {
      position: absolute;
      inset: 14px;
      margin: auto;
      aspect-ratio: 1;
      max-width: calc(100% - 28px);
      max-height: calc(100% - 28px);
      container-type: size;
    }
    /* Soft depth behind the hub. */
    .stage::before {
      content: "";
      position: absolute;
      inset: 8%;
      border-radius: 50%;
      background: radial-gradient(circle at 50% 46%, var(--surface-subtle), transparent 62%);
      opacity: 0.9;
      pointer-events: none;
    }

    .status {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 4;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 3px 10px;
      border-radius: var(--radius-pill);
      background: var(--surface-subtle);
      box-shadow: var(--shadow-widget);
      font: var(--text-meta);
      font-weight: 650;
      color: var(--text-secondary);
      white-space: nowrap;
    }
    .status .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--status-color, var(--text-tertiary));
    }
    .status .txt {
      color: var(--status-color, var(--text-secondary));
      font-variant-numeric: tabular-nums;
    }

    svg.paths {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      overflow: visible;
    }
    .track {
      fill: none;
      stroke: var(--border-subtle);
      stroke-width: 1.4;
      vector-effect: non-scaling-stroke;
    }
    .band {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      vector-effect: non-scaling-stroke;
      filter: drop-shadow(0 0 2px var(--pc));
      opacity: 0;
      transition: opacity var(--motion-content) var(--ease-standard);
    }
    .band.on {
      opacity: 0.32;
    }
    .flow {
      fill: none;
      stroke-width: 2.6;
      stroke-linecap: round;
      stroke-dasharray: 0.5 6;
      vector-effect: non-scaling-stroke;
      animation: march 1.4s linear infinite;
    }
    @keyframes march {
      to {
        stroke-dashoffset: -13;
      }
    }
    .chevron {
      opacity: 0;
      transition: opacity var(--motion-content) var(--ease-standard);
    }
    .chevron.on {
      opacity: 0.9;
    }
    @media (prefers-reduced-motion: reduce) {
      .flow {
        display: none;
      }
    }

    .node {
      position: absolute;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      z-index: 2;
      transition: opacity var(--motion-state) var(--ease-standard);
    }
    .node.idle {
      opacity: 0.45;
    }
    .disc {
      width: clamp(46px, 20cqmin, 62px);
      height: clamp(46px, 20cqmin, 62px);
      border-radius: 50%;
      display: grid;
      place-items: center;
      background: var(--surface);
      color: var(--idle-fg);
      border: 2px solid var(--border-strong);
      box-shadow: var(--shadow-widget);
      transition: color var(--motion-state) var(--ease-standard),
        border-color var(--motion-state) var(--ease-standard), box-shadow var(--motion-state) var(--ease-standard);
    }
    .node.active .disc {
      color: var(--n-fg);
      border-color: var(--n-fg);
      box-shadow: var(--shadow-widget), 0 5px 18px -4px color-mix(in srgb, var(--n-fg) 55%, transparent);
    }
    .node.hub .disc {
      width: clamp(58px, 27cqmin, 82px);
      height: clamp(58px, 27cqmin, 82px);
      background: var(--surface);
      color: var(--text-primary);
      border: 2px solid var(--border-strong);
      box-shadow: var(--shadow-raised);
    }
    .node.hub.active .disc {
      animation: hub 3.4s ease-in-out infinite;
    }
    @keyframes hub {
      50% {
        box-shadow: var(--shadow-raised), 0 0 0 6px color-mix(in srgb, var(--text-primary) 6%, transparent);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .node.hub.active .disc {
        animation: none;
      }
    }
    .label {
      font: var(--text-secondary-state);
      font-weight: 700;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      line-height: 1;
    }
    .node.hub .label {
      font-size: 16px;
    }
    .name {
      font: var(--text-meta);
      color: var(--text-tertiary);
      line-height: 1;
    }
    .node.idle .label {
      color: var(--text-tertiary);
    }
    .autarky {
      font: var(--text-meta);
      font-weight: 650;
      color: var(--state-eco);
      line-height: 1;
    }
  `;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("model")) this._retween();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    cancelAnimationFrame(this._raf);
  }

  private _retween() {
    const m = this.model;
    if (!m) return;
    const target = { grid: m.grid.watts, solar: m.solar.watts, house: m.house.watts, car: m.car.watts };
    const reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      this._shown = target;
      return;
    }
    const from = { ...this._shown };
    const t0 = performance.now();
    const dur = 420;
    cancelAnimationFrame(this._raf);
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = easeOut(p);
      this._shown = {
        grid: lerp(from.grid, target.grid, e),
        solar: lerp(from.solar, target.solar, e),
        house: lerp(from.house, target.house, e),
        car: lerp(from.car, target.car, e),
      };
      if (p < 1) this._raf = requestAnimationFrame(step);
    };
    this._raf = requestAnimationFrame(step);
  }

  private _speed(watts: number): number {
    // Higher power → faster dots.
    return Math.min(2.4, Math.max(0.7, 2.6 - watts / 2500));
  }

  private _conn(
    dir: { d: string; chevron: string },
    track: { d: string },
    active: boolean,
    color: string,
    watts: number,
  ) {
    return svg`
      <path class="track" d=${track.d}></path>
      <path class="band ${active ? "on" : ""}" d=${dir.d} style=${`stroke:${color};--pc:${color}`}></path>
      ${
        active
          ? svg`<path class="flow" d=${dir.d} style=${`stroke:${color};animation-duration:${this._speed(watts)}s`}></path>`
          : nothing
      }
      <polygon class="chevron ${active ? "on" : ""}" points=${dir.chevron} style=${`fill:${color}`}></polygon>
    `;
  }

  private _node(
    key: "grid" | "solar" | "house" | "car",
    icon: string,
    name: string,
    active: boolean,
    fg: string,
    caption?: TemplateResult | typeof nothing,
  ) {
    const [x, y] = N[key];
    const isHub = key === "house";
    const cls = `node ${isHub ? "hub " : ""}${active ? "active" : "idle"}`;
    return html`<div class="${cls}" style=${`left:${x}%;top:${y}%;--n-fg:${fg}`}>
      <div class="disc"><hd-icon .icon=${icon} .size=${isHub ? 26 : 22}></hd-icon></div>
      <div class="label">${powerText(this._shown[key])}</div>
      ${caption ?? html`<div class="name">${name}</div>`}
    </div>`;
  }

  render() {
    const m = this.model;
    if (!m) return nothing;
    const eco = "var(--state-eco)";
    const blue = "var(--accent)";

    const importing = m.grid.mode !== "export";
    const gridColor = m.grid.mode === "export" ? eco : blue;
    const carColor = m.paths.houseCar.source === "solar" ? eco : blue;

    // Connection geometry (directional for band/dots, plain for track).
    const ghDir = importing
      ? curve(N.grid, CTRL.grid, N.house, SAT_R, HUB_R)
      : curve(N.house, CTRL.grid, N.grid, HUB_R, SAT_R);
    const ghTrack = curve(N.grid, CTRL.grid, N.house, SAT_R, HUB_R);
    const shDir = curve(N.solar, CTRL.solar, N.house, SAT_R, HUB_R);
    const hcDir = curve(N.house, CTRL.car, N.car, HUB_R, SAT_R);

    const statusColor = m.grid.mode === "export" ? eco : m.grid.mode === "import" ? blue : "var(--text-tertiary)";
    const statusText =
      m.grid.mode === "export"
        ? `Exporting ${powerText(m.grid.watts)}`
        : m.grid.mode === "import"
          ? `Importing ${powerText(m.grid.watts)}`
          : "Grid balanced";

    const showAutarky = m.solar.watts > FLOW_DEADBAND_W;

    return html`
      <div class="stage">
        <div class="status" style=${`--status-color:${statusColor}`}>
          <span class="dot"></span><span class="txt">${statusText}</span>
        </div>

        <svg class="paths" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          ${this._conn(shDir, shDir, m.paths.solarHouse.active, eco, m.paths.solarHouse.watts)}
          ${this._conn(ghDir, ghTrack, m.paths.gridHouse.active, gridColor, m.paths.gridHouse.watts)}
          ${this._conn(hcDir, hcDir, m.paths.houseCar.active, carColor, m.paths.houseCar.watts)}
        </svg>

        ${this._node("solar", "mdi:solar-power", "Solar", m.solar.active, eco)}
        ${this._node(
          "grid",
          m.grid.mode === "export" ? "mdi:transmission-tower-export" : "mdi:transmission-tower",
          m.grid.mode === "export" ? "Export" : "Grid",
          m.grid.active,
          gridColor,
        )}
        ${this._node(
          "car",
          m.car.connected ? "mdi:car-electric" : "mdi:car-electric-outline",
          "Car",
          m.car.active,
          carColor,
        )}
        ${this._node(
          "house",
          "mdi:home-variant",
          "House",
          m.house.active,
          "var(--text-primary)",
          showAutarky
            ? html`<div class="autarky">${m.selfSufficiency}% solar</div>`
            : html`<div class="name">House</div>`,
        )}
      </div>
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
    return this.config.type === "powerflow" ? this.config.options ?? {} : {};
  }

  protected override relevantEntityIds(): string[] {
    return Object.values(this._opts).filter((v): v is string => typeof v === "string");
  }

  protected override hasDetail(): boolean {
    return true;
  }

  renderContent(): TemplateResult {
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
