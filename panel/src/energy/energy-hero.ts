import { LitElement, css, html, type TemplateResult } from "lit";
import { property, query } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { EnergyHeroConfig } from "../config/schema.js";
import { FLOW_DEADBAND_W, toWatts } from "../home-assistant/energy-flow.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import { HOUSE_IMAGE, HOUSE_IMAGE_HEIGHT, HOUSE_IMAGE_WIDTH } from "./house-image.js";
import "../primitives/entity-icon.js";

/**
 * The Energy page hero — Homey's 960×720 house render with the day's Grid /
 * Solar / Home totals overlaid and live energy **flows** glowing along the
 * conduit lines. It is a page asset, not a widget: `hd-view-grid` renders it
 * above the widget grid when a view declares `hero`.
 *
 * The flows use Homey's own technique: each is a 113-frame, 30fps image
 * SEQUENCE drawn onto a `<canvas>` (the frames live in `public/flows/<type>/`
 * and ship same-origin — `/local/home-dashboard/flows/…` in production). Because
 * the frames were authored to overlay this exact 960×720 house, they line up
 * pixel-for-pixel. Live state decides which sequences play; the loop idles when
 * nothing flows or the tab is hidden, and shows a single still frame under
 * `prefers-reduced-motion`.
 */

// Frames are served same-origin. Vite serves `public/` at `/` in dev and copies
// it into the deploy mirror on build (→ `/local/home-dashboard/flows/`).
const FRAME_BASE = (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV
  ? "/flows"
  : "/local/home-dashboard/flows";

const SEQ_TOTAL = 113;
const SEQ_FPS = 30;

/** Flow-sequence folders (each is also the file prefix) under `flows/`. */
const DIR = {
  solar: "solar-generating",
  grid: "grid-exporting",
  home: "home-consuming",
  ev: "ev-charging",
} as const;

/**
 * One sequence to play this tick. Homey ships no grid-IMPORT sequence, so grid
 * import reuses the export sequence played in REVERSE — the green glow then
 * travels the utility line from the ground up into the house instead of out.
 */
interface FlowPlay {
  dir: string;
  reverse: boolean;
}

/** A lazily-loaded image sequence; frames decode as they arrive. */
class FrameSequence {
  private frames: HTMLImageElement[] = [];
  private started = false;
  loaded = 0;
  constructor(
    private base: string,
    private total: number,
  ) {}

  start(): void {
    if (this.started) return;
    this.started = true;
    for (let i = 0; i < this.total; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        this.loaded++;
      };
      img.src = `${this.base}.${i}.webp`;
      this.frames[i] = img;
    }
  }

  /** The frame image if it has decoded, else null (skip drawing this tick). */
  frame(i: number): HTMLImageElement | null {
    const img = this.frames[i];
    return img && img.complete && img.naturalWidth > 0 ? img : null;
  }
}

@define("hd-energy-hero")
export class EnergyHero extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) options?: EnergyHeroConfig;

  @query("canvas") private _canvas?: HTMLCanvasElement;

  private _seqs = new Map<string, FrameSequence>();
  private _active: FlowPlay[] = [];
  private _raf = 0;
  private _running = false;
  private _ro?: ResizeObserver;
  private _reduce = false;

  static styles = css`
    :host {
      display: block;
    }
    .hero {
      position: relative;
      overflow: hidden;
      border-radius: 0 0 28px 28px;
      background: linear-gradient(
        180deg,
        #2f6bff 0%,
        #4f86ff 22%,
        #9dc0ff 46%,
        #e7eefb 70%,
        var(--canvas) 100%
      );
      padding: 18px clamp(16px, 4vw, 40px) 8px;
    }
    .inner {
      max-width: 1000px;
      margin: 0 auto;
    }
    .bar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 6px;
    }
    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.22);
      color: #fff;
      font: var(--text-widget-title);
      font-weight: 600;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
      color: #fff;
      position: relative;
      z-index: 2;
    }
    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 4px 6px 0;
      position: relative;
    }
    .stat .v {
      font: 700 clamp(20px, 5.5vw, 30px) / 1.05 var(--font-sans);
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 5px;
    }
    .stat .v .u {
      font-size: 0.5em;
      font-weight: 600;
      opacity: 0.9;
    }
    .stat .l {
      font: var(--text-secondary-state);
      opacity: 0.82;
      margin-top: 2px;
    }
    .stat::after {
      content: "";
      position: absolute;
      top: 100%;
      width: 1px;
      height: clamp(24px, 8vw, 52px);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
    }
    .house {
      position: relative;
      width: 100%;
      max-width: 820px;
      margin: -4px auto 0;
      aspect-ratio: ${HOUSE_IMAGE_WIDTH} / ${HOUSE_IMAGE_HEIGHT};
    }
    .house img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      -webkit-user-drag: none;
      user-select: none;
    }
    canvas.flows {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopLoop();
    this._ro?.disconnect();
  }

  firstUpdated(): void {
    const house = this.renderRoot.querySelector(".house");
    if (house) {
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(house);
    }
    this._resize();
    this._computeActive();
    this._syncLoop();
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("hass") || changed.has("options")) {
      this._computeActive();
      this._syncLoop();
    }
  }

  // ---- live state → active sequences -------------------------------------

  private _watts(id?: string): number | null {
    return id ? toWatts(this.hass?.states[id]) : null;
  }
  private _num(id?: string): number | null {
    if (!id) return null;
    const n = Number(this.hass?.states[id]?.state);
    return Number.isFinite(n) ? n : null;
  }

  private _computeActive(): void {
    const o = this.options;
    const gridW = this._watts(o?.gridPower) ?? 0;
    const solarW = this._watts(o?.solarPower) ?? 0;
    const carW = this._watts(o?.carPower) ?? 0;
    const carConnected = o?.carConnected ? this.hass?.states[o.carConnected]?.state === "on" : false;
    const houseW = solarW + gridW - carW; // grid signed (+import)

    const plays: FlowPlay[] = [];
    if (solarW > FLOW_DEADBAND_W) plays.push({ dir: DIR.solar, reverse: false });
    // Grid utility line: export travels box→ground; import is the same sequence
    // reversed so the glow travels ground→box (energy pulled from the grid).
    if (gridW < -FLOW_DEADBAND_W) plays.push({ dir: DIR.grid, reverse: false });
    else if (gridW > FLOW_DEADBAND_W) plays.push({ dir: DIR.grid, reverse: true });
    if (houseW > FLOW_DEADBAND_W) plays.push({ dir: DIR.home, reverse: false });
    if (carConnected && carW > FLOW_DEADBAND_W) plays.push({ dir: DIR.ev, reverse: false });
    this._active = plays;

    // Lazily create + preload each active sequence (keyed by folder so the grid
    // sequence is shared between export and reversed-import playback).
    for (const p of plays) {
      if (!this._seqs.has(p.dir)) {
        this._seqs.set(p.dir, new FrameSequence(`${FRAME_BASE}/${p.dir}/${p.dir}`, SEQ_TOTAL));
      }
      this._seqs.get(p.dir)!.start();
    }
  }

  // ---- animation loop -----------------------------------------------------

  private _syncLoop(): void {
    if (!this._canvas) return;
    if (this._reduce) {
      this._stopLoop();
      this._drawFrame(Math.floor(SEQ_TOTAL * 0.5));
      return;
    }
    // Run whenever something flows; the browser throttles rAF on its own when
    // the tab is truly backgrounded (no manual visibility gate — kiosk/webview
    // panels report visibility unreliably, which would freeze the flows).
    const shouldRun = this._active.length > 0;
    if (shouldRun && !this._running) {
      this._running = true;
      this._raf = requestAnimationFrame((t) => this._tick(t));
    } else if (!shouldRun && this._running) {
      this._stopLoop();
      this._clear();
    }
  }

  private _stopLoop(): void {
    this._running = false;
    cancelAnimationFrame(this._raf);
  }

  private _tick(now: number): void {
    if (!this._running) return;
    const frame = Math.floor((now / 1000) * SEQ_FPS) % SEQ_TOTAL;
    this._drawFrame(frame);
    this._raf = requestAnimationFrame((t) => this._tick(t));
  }

  // ---- canvas -------------------------------------------------------------

  private _resize(): void {
    const c = this._canvas;
    const house = this.renderRoot.querySelector(".house") as HTMLElement | null;
    if (!c || !house) return;
    const w = house.clientWidth;
    const h = house.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    if (this._reduce) this._drawFrame(Math.floor(SEQ_TOTAL * 0.5));
  }

  private _clear(): void {
    const ctx = this._canvas?.getContext("2d");
    if (this._canvas && ctx) ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  private _drawFrame(frame: number): void {
    const c = this._canvas;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    for (const p of this._active) {
      const idx = p.reverse ? SEQ_TOTAL - 1 - frame : frame;
      const img = this._seqs.get(p.dir)?.frame(idx);
      if (img) ctx.drawImage(img, 0, 0, c.width, c.height);
    }
  }

  // ---- markup -------------------------------------------------------------

  private _stat(value: number | null, label: string): TemplateResult {
    return html`<div class="stat">
      <span class="v">${value == null ? "—" : formatNumber(value)}<span class="u">kWh</span></span>
      <span class="l">${label}</span>
    </div>`;
  }

  render(): TemplateResult {
    const o = this.options;
    const solarToday = this._num(o?.solar);
    const gridToday = this._num(o?.grid);
    const homeToday = gridToday != null && solarToday != null ? gridToday + solarToday : null;

    return html`
      <div class="hero">
        <div class="inner">
          <div class="bar">
            <span class="pill">
              ${o?.label ?? "Today"}
              <hd-icon icon="mdi:calendar-blank" .size=${18}></hd-icon>
            </span>
          </div>
          <div class="stats">
            ${this._stat(gridToday, "Grid")} ${this._stat(solarToday, "Solar Panels")}
            ${this._stat(homeToday, "Home")}
          </div>
          <div class="house">
            <img src=${HOUSE_IMAGE} alt="" aria-hidden="true" />
            <canvas class="flows" aria-hidden="true"></canvas>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-energy-hero": EnergyHero;
  }
}
