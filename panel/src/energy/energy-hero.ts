import { LitElement, css, html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { EnergyHeroConfig } from "../config/schema.js";
import { FLOW_DEADBAND_W, toWatts } from "../home-assistant/energy-flow.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import { panelAssetUrl } from "../panel/assets.js";
import "../primitives/entity-icon.js";

const HOUSE_IMAGE_WIDTH = 960;
const HOUSE_IMAGE_HEIGHT = 720;

export type EnergyFlowAsset =
  | "solar-generating"
  | "grid-exporting"
  | "grid-importing"
  | "home-consuming"
  | "ev-charging";

/** Resolve the diagram layers that should be visible for the current HA state. */
export function activeEnergyFlows(
  hass?: HomeAssistant,
  options?: EnergyHeroConfig,
): EnergyFlowAsset[] {
  if (!hass || !options) return [];

  const watts = (entityId?: string): number | null =>
    entityId ? toWatts(hass.states[entityId]) : null;
  const gridW = watts(options.gridPower) ?? 0;
  const solarW = watts(options.solarPower) ?? 0;
  const carW = watts(options.carPower) ?? 0;
  const carConnected = options.carConnected
    ? hass.states[options.carConnected]?.state === "on"
    : false;
  const houseW = solarW + gridW - carW;
  const flows: EnergyFlowAsset[] = [];

  if (solarW > FLOW_DEADBAND_W) flows.push("solar-generating");
  if (gridW < -FLOW_DEADBAND_W) flows.push("grid-exporting");
  else if (gridW > FLOW_DEADBAND_W) flows.push("grid-importing");
  if (houseW > FLOW_DEADBAND_W) flows.push("home-consuming");
  if (carConnected && carW > FLOW_DEADBAND_W) flows.push("ev-charging");

  return flows;
}

/**
 * The Energy page hero — Homey's 960×720 house render with the day's Grid /
 * Solar / Home totals overlaid and live energy **flows** glowing along the
 * conduit lines. It is a page asset, not a widget: `hd-view-grid` renders it
 * above the widget grid when a view declares `hero`.
 *
 * The flows are browser-native animated WebP layers authored to overlay the
 * exact 960×720 house. Live state decides which layers are mounted; reduced
 * motion receives matching still images.
 */
@define("hd-energy-hero")
export class EnergyHero extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) options?: EnergyHeroConfig;

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
    .house > img {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      -webkit-user-drag: none;
      user-select: none;
    }
    .house-art {
      z-index: 0;
    }
    .flow {
      z-index: 1;
      pointer-events: none;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._reduce =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }

  private _num(id?: string): number | null {
    if (!id) return null;
    const n = Number(this.hass?.states[id]?.state);
    return Number.isFinite(n) ? n : null;
  }

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
    const flows = activeEnergyFlows(this.hass, o);

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
            <img
              class="house-art"
              src=${panelAssetUrl("assets/energy-house.webp")}
              alt=""
              aria-hidden="true"
            />
            ${repeat(
              flows,
              (flow) => flow,
              (flow) => html`
                <img
                  class="flow"
                  src=${panelAssetUrl(
                    `assets/energy-flows/${flow}${this._reduce ? "-still" : ""}.webp`,
                  )}
                  alt=""
                  aria-hidden="true"
                  decoding="async"
                />
              `,
            )}
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
