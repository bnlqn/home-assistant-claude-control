import { css, html, nothing } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { buildToggle } from "../home-assistant/service-calls.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import type { HomeAssistant } from "../types/hass.js";
import "./widget-frame.js";
import "../primitives/misc.js";

/**
 * Entity map for the bespoke Tesla solar-charging control system. Every id is
 * optional so the widget degrades gracefully when one sensor is missing.
 */
export interface SolarChargingOptions {
  /** input_boolean master arm for the solar-charging automation. */
  master?: string;
  /** binary_sensor — is the car plugged into the wall connector. */
  vehicleConnected?: string;
  /** sensor (enum) — car's own charging state. */
  chargingState?: string;
  /** sensor (enum) — wall connector status. */
  wallStatus?: string;
  /** sensor (kW) — live charge power. */
  chargePower?: string;
  /** sensor (%) — car battery level. */
  battery?: string;
  /** number (%) — target charge limit. */
  chargeLimit?: string;
  /** sensor (kWh) — energy delivered this session. */
  sessionEnergy?: string;
  /** sensor (km/h) — charge rate. */
  chargeRate?: string;
  /** number (A) — commanded charge current. */
  chargeCurrent?: string;
  /** input_number (W, negative) — start when grid export exceeds this. */
  startThreshold?: string;
  /** input_number (W) — stop when grid import exceeds this. */
  stopThreshold?: string;
  /** input_number (A) — minimum charge current. */
  minCurrent?: string;
  /** input_number (A) — current deadband. */
  deadband?: string;
}

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
    return (this.config.options ?? {}) as SolarChargingOptions;
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
  `;

  private _toggleMaster() {
    const master = this._opts.master;
    if (master) void this.callService(buildToggle(master), { errorVerb: "toggle solar charging" });
  }

  renderContent() {
    const m = buildSolarChargingModel(this.hass, this._opts);
    const size = this.currentSize;
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
