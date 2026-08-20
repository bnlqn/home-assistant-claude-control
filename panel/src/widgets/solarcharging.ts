import { css, html, nothing, unsafeCSS } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { buildToggle } from "../home-assistant/service-calls.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import { panelAssetUrl } from "../panel/assets.js";
import type { HomeAssistant } from "../types/hass.js";
import type { SolarChargingWidgetOptions } from "../config/widget-options.js";
import "./widget-frame.js";
import "../primitives/misc.js";
import "../primitives/entity-icon.js";

/**
 * Tesla's official brand red (#E82127 — the wordmark/badge red), paired with a
 * deeper shade for gradient depth so white text clears AA on the panel.
 */
const TESLA_RED = "#E82127";

/**
 * Entity map for the bespoke Tesla solar-charging control system. Every id is
 * optional so the widget degrades gracefully when one sensor is missing.
 */
export type SolarChargingOptions = SolarChargingWidgetOptions;

export type SolarPhase = "unplugged" | "charging" | "complete" | "waiting" | "off";

export interface SolarChargingModel {
  armed: boolean;
  connected: boolean;
  phase: SolarPhase;
  powerKw: number | null;
  batteryPct: number | null;
  limitPct: number | null;
  sessionKwh: number | null;
  rateKmh: number | null;
  currentA: number | null;
  /** Human status line. */
  label: string;
  tone: "eco" | "accent" | "neutral";
  icon: string;
}

const num = (hass: HomeAssistant | undefined, id?: string): number | null => {
  if (!id || !hass) return null;
  const s = hass.states[id];
  if (!s) return null;
  const n = Number(s.state);
  return Number.isFinite(n) ? n : null;
};

const stateOf = (hass: HomeAssistant | undefined, id?: string): string | undefined =>
  id ? hass?.states[id]?.state : undefined;

/**
 * Pure derivation of the solar-charging status from live state. Shared by the
 * tile and the detail so both tell exactly the same story.
 */
export function buildSolarChargingModel(
  hass: HomeAssistant | undefined,
  o: SolarChargingOptions,
): SolarChargingModel {
  const armed = stateOf(hass, o.master) === "on";
  const connected = stateOf(hass, o.vehicleConnected) === "on";
  const chargingState = stateOf(hass, o.chargingState);
  const powerKw = num(hass, o.chargePower);
  const batteryPct = num(hass, o.battery);
  const limitPct = num(hass, o.chargeLimit);
  const sessionKwh = num(hass, o.sessionEnergy);
  const rateKmh = num(hass, o.chargeRate);
  const currentA = num(hass, o.chargeCurrent);

  const activelyCharging =
    chargingState === "charging" || chargingState === "starting" || (powerKw ?? 0) > 0.1;
  const complete = chargingState === "complete";

  let phase: SolarPhase;
  if (!connected) phase = "unplugged";
  else if (activelyCharging) phase = "charging";
  else if (complete) phase = "complete";
  else if (armed) phase = "waiting";
  else phase = "off";

  const kw = powerKw != null ? formatNumber(powerKw) : "—";
  const map: Record<SolarPhase, Pick<SolarChargingModel, "label" | "tone" | "icon">> = {
    unplugged: { label: "Car not connected", tone: "neutral", icon: "mdi:ev-plug-type2" },
    charging: {
      label: armed ? `Solar charging · ${kw} kW` : `Charging · ${kw} kW`,
      tone: armed ? "eco" : "accent",
      icon: "mdi:ev-station",
    },
    complete: { label: "Charge complete", tone: "eco", icon: "mdi:battery-charging-100" },
    waiting: { label: "Waiting for surplus", tone: "accent", icon: "mdi:solar-power-variant" },
    off: { label: "Solar mode off", tone: "neutral", icon: "mdi:ev-station" },
  };

  return {
    armed,
    connected,
    phase,
    powerKw,
    batteryPct,
    limitPct,
    sessionKwh,
    rateKmh,
    currentA,
    ...map[phase],
  };
}

/**
 * Solar-charging widget (entityless — reads its sensors/helpers from `options`).
 * The icon quick-toggles the solar-charging master; the body opens a detail with
 * live charge status and the grid-power thresholds as sliders. Bespoke to this
 * home's Tesla + Wall Connector + solar automation.
 */
@define("hd-widget-solarcharging")
export class SolarChargingWidget extends EntityWidget {
  private get _opts(): SolarChargingOptions {
    return this.config.type === "solarcharging" ? this.config.options ?? {} : {};
  }

  private get _branded(): boolean {
    const o = this._opts;
    return o.brand === "tesla" || o.branded === true;
  }

  protected override relevantEntityIds(): string[] {
    return Object.values(this._opts).filter((v): v is string => typeof v === "string");
  }

  protected override hasDetail(): boolean {
    return true;
  }

  static styles = css`
    .battery {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .battery .line {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      font: var(--text-meta);
      color: var(--text-secondary);
    }
    .battery .line .soc {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
    .bar {
      position: relative;
      height: 8px;
      border-radius: 999px;
      background: var(--idle-bg);
      overflow: hidden;
    }
    .bar .fill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: 999px;
      background: var(--fill, var(--accent));
      transition: width var(--motion-state) var(--ease-standard);
    }
    .bar .limit {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 2px;
      background: var(--text-tertiary);
      opacity: 0.7;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    /* ---- Tesla branded hero (dark premium) ------------------------------ */
    .hero {
      position: relative;
      min-height: 300px;
      height: 100%;
      width: 100%;
      overflow: hidden;
      color: #fff;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 22px 26px;
      box-sizing: border-box;
      /* Graphite → near-black base, with Tesla red as a glow from the lower
         right (behind the car) — dark and minimal, red as accent not fill. */
      background:
        radial-gradient(115% 130% at 84% 118%, rgba(232, 33, 39, 0.5) 0%, rgba(232, 33, 39, 0) 52%),
        radial-gradient(120% 130% at 8% -25%, #303236 0%, #191b1e 48%, #0b0c0e 100%);
    }
    /* bottom vignette so the car's base grounds into the dark */
    .hero::before {
      content: "";
      position: absolute;
      inset: auto 0 0 0;
      height: 42%;
      background: linear-gradient(to top, rgba(8, 9, 10, 0.72) 0%, rgba(8, 9, 10, 0) 100%);
      z-index: 1;
    }
    .hero .glow {
      position: absolute;
      right: -6%;
      bottom: -4%;
      width: 82%;
      height: 86%;
      background: radial-gradient(closest-side, rgba(232, 33, 39, 0.55), rgba(232, 33, 39, 0) 70%);
      z-index: 0;
      pointer-events: none;
    }
    .hero .car {
      position: absolute;
      right: -4%;
      bottom: 4%;
      width: 70%;
      height: auto;
      max-height: 78%;
      object-fit: contain;
      filter: drop-shadow(0 18px 26px rgba(0, 0, 0, 0.55));
      /* fade the image's baked ground shadow into the dark base */
      -webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent 98%);
      mask-image: linear-gradient(to bottom, #000 78%, transparent 98%);
      z-index: 2;
      pointer-events: none;
      user-select: none;
    }
    .hero[data-charging] .glow {
      animation: teslapulse 3.4s ease-in-out infinite;
    }
    @keyframes teslapulse {
      50% {
        opacity: 0.62;
        transform: scale(1.07);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero[data-charging] .glow {
        animation: none;
      }
    }
    .hero .top,
    .hero .bottom {
      position: relative;
      z-index: 2;
    }
    .hero .brand {
      font: var(--text-meta);
      font-weight: 700;
      letter-spacing: 0.34em;
      text-transform: uppercase;
      opacity: 0.92;
    }
    .hero .htext {
      margin-top: 6px;
      max-width: 60%;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .hero .hname {
      font: var(--text-widget-title);
      font-weight: 650;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero .hstatus {
      font: var(--text-secondary-state);
      color: rgba(255, 255, 255, 0.94);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero .hbattery {
      max-width: 54%;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .hero .brow {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font: var(--text-meta);
      color: rgba(255, 255, 255, 0.9);
      font-variant-numeric: tabular-nums;
    }
    .hero .btrack {
      position: relative;
      height: 6px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.28);
      overflow: hidden;
    }
    .hero .bfill {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      background: #fff;
      transition: width var(--motion-state) var(--ease-standard);
    }
    .hero .blimit {
      position: absolute;
      top: -2px;
      bottom: -2px;
      width: 2px;
      background: rgba(255, 255, 255, 0.85);
    }
    .hero .controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .hero .pill {
      appearance: none;
      border: none;
      cursor: pointer;
      height: 44px;
      min-width: 44px;
      padding: 0 16px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.17);
      color: #fff;
      font: var(--text-meta);
      font-weight: 650;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      transition: background var(--motion-state) var(--ease-standard), transform var(--motion-press) var(--ease-standard);
    }
    .hero .pill:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    .hero .pill:active {
      transform: scale(0.94);
    }
    .hero .pill.armed {
      background: #fff;
      color: ${unsafeCSS(TESLA_RED)};
    }
    .hero .pill.armed:hover {
      background: rgba(255, 255, 255, 0.88);
    }
    .hero .pill:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.65);
    }
    @media (prefers-reduced-motion: reduce) {
      .hero .pill:active {
        transform: none;
      }
    }
  `;

  private _toggleMaster() {
    const master = this._opts.master;
    if (master) void this.callService(buildToggle(master), { errorVerb: "toggle solar charging" });
  }

  /** Full-bleed Tesla-branded hero (2×2): red panel + Model 3 product shot. */
  private _renderHero(m: SolarChargingModel) {
    const soc = m.batteryPct;
    const limit = m.limitPct;
    const charging = m.phase === "charging";
    // Power already reads in the status label; the meta line adds only rate /
    // session so nothing is repeated.
    const metaBits: string[] = [];
    if (m.rateKmh != null && m.rateKmh > 0.5) metaBits.push(`${Math.round(m.rateKmh)} km/h`);
    if (m.sessionKwh != null && m.sessionKwh > 0.01) metaBits.push(`${formatNumber(m.sessionKwh)} kWh session`);

    const battery =
      soc != null
        ? html`<div class="hbattery">
            <div class="brow">
              <span>Battery ${Math.round(soc)}%</span>
              <span>${limit != null ? `Target ${Math.round(limit)}%` : ""}</span>
            </div>
            <div class="btrack">
              <div class="bfill" style=${`width:${Math.min(100, Math.max(0, soc))}%`}></div>
              ${limit != null
                ? html`<div class="blimit" style=${`left:${Math.min(100, Math.max(0, limit))}%`}></div>`
                : nothing}
            </div>
          </div>`
        : nothing;

    return html`
      <hd-widget-frame
        bleed
        .size=${this.currentSize}
        .accent=${m.tone === "neutral" ? "idle" : m.tone}
        .active=${m.armed}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="hero" ?data-charging=${charging && m.armed}>
          <div class="glow"></div>
          <img
            class="car"
            src=${panelAssetUrl("assets/tesla-model-3.webp")}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <div class="top">
            <div class="brand">Tesla</div>
            <div class="htext">
              <span class="hname">${this.config.name ?? "Solar charging"}</span>
              <span class="hstatus">${m.label}</span>
              ${metaBits.length ? html`<span class="hstatus">${metaBits.join(" · ")}</span>` : nothing}
            </div>
          </div>
          <div class="bottom">
            ${battery}
            <div class="controls" @click=${(e: Event) => e.stopPropagation()}>
              <button
                class="pill ${m.armed ? "armed" : ""}"
                aria-pressed=${m.armed ? "true" : "false"}
                aria-label=${m.armed ? "Turn off solar charging" : "Turn on solar charging"}
                @click=${() => this._toggleMaster()}
              >
                <hd-icon icon="mdi:solar-power-variant" .size=${18}></hd-icon>
                ${m.armed ? "Solar on" : "Solar off"}
              </button>
            </div>
          </div>
        </div>
      </hd-widget-frame>
    `;
  }

  renderContent() {
    const m = buildSolarChargingModel(this.hass, this._opts);
    const size = this.currentSize;

    if (this._branded && size === "2x2") return this._renderHero(m);
    const soc = m.batteryPct;
    const limit = m.limitPct;
    const fillColor =
      m.phase === "charging" && m.armed ? "var(--state-eco)" : "var(--accent)";

    const showBattery = soc != null && (size === "2x2" || size === "1x2");
    const showStats = size === "2x2" || size === "1x2" || size === "2x1";

    return html`
      <hd-widget-frame
        .icon=${m.icon}
        .name=${this.config.name ?? "Solar charging"}
        .stateText=${m.label}
        .secondary=${soc != null ? `Battery ${Math.round(soc)}%${limit != null ? ` → ${Math.round(limit)}%` : ""}` : ""}
        .size=${size}
        .accent=${m.tone === "neutral" ? "idle" : m.tone}
        .active=${m.armed}
        .hasDetail=${true}
        .quickKind=${"toggle"}
        .quickLabel=${m.armed ? "Turn off solar charging" : "Turn on solar charging"}
        @hd-quick=${() => this._toggleMaster()}
        @hd-activate=${() => this.openDetail()}
      >
        ${showBattery
          ? html`<div class="battery">
              <div class="line">
                <span class="soc">${Math.round(soc!)}%</span>
                ${limit != null ? html`<span>Target ${Math.round(limit)}%</span>` : nothing}
              </div>
              <div class="bar" style=${`--fill:${fillColor}`}>
                <div class="fill" style=${`width:${Math.min(100, Math.max(0, soc!))}%`}></div>
                ${limit != null
                  ? html`<div class="limit" style=${`left:${Math.min(100, Math.max(0, limit))}%`}></div>`
                  : nothing}
              </div>
            </div>`
          : nothing}
        ${showStats
          ? html`<div class="stats">
              ${m.powerKw != null && m.powerKw > 0.05
                ? html`<hd-status-badge
                    tone=${m.armed ? "eco" : "accent"}
                    icon="mdi:flash"
                    text=${`${formatNumber(m.powerKw)} kW`}
                  ></hd-status-badge>`
                : nothing}
              ${m.sessionKwh != null && m.sessionKwh > 0.01
                ? html`<hd-status-badge
                    tone="neutral"
                    icon="mdi:counter"
                    text=${`${formatNumber(m.sessionKwh)} kWh session`}
                  ></hd-status-badge>`
                : nothing}
              ${m.rateKmh != null && m.rateKmh > 0.5
                ? html`<hd-status-badge
                    tone="neutral"
                    icon="mdi:speedometer"
                    text=${`${Math.round(m.rateKmh)} km/h`}
                  ></hd-status-badge>`
                : nothing}
            </div>`
          : nothing}
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-solarcharging": SolarChargingWidget;
  }
}
