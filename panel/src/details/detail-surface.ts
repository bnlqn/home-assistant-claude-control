import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { WidgetConfig } from "../config/schema.js";
import { execute, type ServiceCall } from "../home-assistant/service-calls.js";
import { normalizeEntity } from "../home-assistant/entity-adapters/index.js";
import { fetchNumericHistory } from "../home-assistant/history.js";
import { toast } from "../primitives/feedback.js";
import { widgetDefinition } from "../widgets/widget-definition.js";
import {
  detailNeedsForecast,
  detailNeedsHistory,
  renderDetailBody,
} from "./controllers.js";
import type { DetailContext } from "./detail-context.js";
import { renderDefinedDetail } from "./detail-registry.js";
import "../primitives/surface.js";
import "../primitives/toggle.js";
import "../primitives/slider.js";
import "../primitives/segmented.js";
import "../primitives/icon-button.js";
import "../primitives/entity-icon.js";
import "../primitives/misc.js";

/**
 * The single adaptive detail surface for every widget. Bottom sheet on narrow
 * panels, right drawer on wide (via `hd-surface variant="auto"`). Reads live
 * state on every render so it updates in real time while open, lazily loads
 * history/forecast, and delegates the body to a domain controller.
 */
@define("hd-detail")
export class HdDetail extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) entityId = "";
  @property({ attribute: false }) config?: WidgetConfig;

  @state() private _trend: number[] = [];
  @state() private _forecast: DetailContext["forecast"] = [];
  private _loadedKey = "";

  static styles = css`
    .d-section {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .d-row-between {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .d-label {
      font: var(--text-widget-title);
      color: var(--text-secondary);
      font-weight: 600;
    }
    .d-value {
      font: var(--text-value);
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .d-value.big {
      font: var(--text-value-lg);
    }
    .d-sub {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
    }
    .d-meta {
      font: var(--text-meta);
      color: var(--text-tertiary);
      margin-top: 8px;
    }
    .color-wheel-wrap {
      min-height: 240px;
    }
    .swatches {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .swatch {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid var(--surface);
      box-shadow: 0 0 0 1px var(--border-strong);
      cursor: pointer;
    }
    .swatch:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .swatch:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .chip {
      appearance: none;
      border: none;
      cursor: pointer;
      padding: 9px 14px;
      border-radius: var(--radius-pill);
      background: var(--surface-subtle);
      color: var(--text-secondary);
      font: var(--text-secondary-state);
      font-weight: 600;
      min-height: 40px;
    }
    .chip.with-icon {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .chip.with-icon hd-icon {
      opacity: 0.85;
    }
    .chip.active {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    .chip.active.with-icon hd-icon {
      opacity: 1;
    }
    .chip:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .big-buttons {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 10px;
    }
    .bigbtn {
      flex: 1 1 30%;
      min-height: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: none;
      cursor: pointer;
      border-radius: var(--radius-control);
      background: var(--surface-subtle);
      color: var(--text-primary);
      font: var(--text-secondary-state);
      font-weight: 650;
    }
    .bigbtn.active {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .bigbtn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    /* Featured streaming-app launchers — bigger, branded, primary. */
    .media-apps {
      display: flex;
      gap: 10px;
    }
    .bigbtn.app {
      min-height: 74px;
      gap: 9px;
      border-radius: var(--radius-widget);
      font-weight: 700;
    }
    .bigbtn.app hd-icon {
      opacity: 0.95;
    }
    .bigbtn.app.active {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    .climate-hero {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-top: 8px;
    }
    .climate-target {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .climate-target .big {
      font: var(--text-value-lg);
      font-size: 44px;
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
    .climate-target .sub {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .media-art {
      width: 100%;
      height: 180px;
      border-radius: var(--radius-widget);
      background-size: cover;
      background-position: center;
      background-color: var(--surface-sunken);
    }
    .media-art-fallback {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--text-secondary);
      background: linear-gradient(135deg, var(--surface-subtle), var(--surface-sunken));
    }
    .media-art-fallback span {
      font: var(--text-widget-title);
      font-weight: 650;
      letter-spacing: 0.02em;
    }
    .media-meta {
      margin-top: 12px;
    }
    .media-progress {
      gap: 6px;
    }
    .media-progress-bar {
      height: 6px;
      border-radius: var(--radius-pill);
      background: var(--surface-subtle);
      overflow: hidden;
    }
    .media-progress-bar span {
      display: block;
      height: 100%;
      border-radius: var(--radius-pill);
      background: var(--accent);
    }
    .media-progress-time {
      display: flex;
      justify-content: space-between;
      font: var(--text-meta);
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
    }
    .media-transport {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .vol-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .d-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 6px;
    }
    .d-cell {
      background: var(--surface-subtle);
      border-radius: var(--radius-control);
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .d-cell .k {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .d-cell .v {
      font: var(--text-secondary-state);
      color: var(--text-primary);
      font-weight: 650;
      font-variant-numeric: tabular-nums;
    }
    .detail-trend {
      height: 90px;
    }
    .detail-flow {
      height: 320px;
      margin: 4px 0 8px;
    }
    .fc-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-top: 1px solid var(--border-subtle);
    }
    .fc-day {
      flex: 1;
      font: var(--text-secondary-state);
      color: var(--text-primary);
    }
    .fc-temp {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
    }
  `;

  updated(changed: Map<string, unknown>) {
    if (changed.has("open") || changed.has("entityId")) {
      if (this.open) this._maybeLoad();
      else if (this._loadedKey) {
        if (this._trend.length) this._trend = [];
        if (this._forecast.length) this._forecast = [];
        this._loadedKey = "";
      }
    }
  }

  private async _maybeLoad() {
    // Note: entityless detail (energy / powerflow) has no entityId — don't gate
    // on it, or their 24 h trend would never load.
    if (!this.hass) return;
    const key = `${this.entityId}:${this.config?.type ?? ""}:${this.config?.id ?? ""}`;
    if (this._loadedKey === key) return;
    this._loadedKey = key;
    if (this._trend.length) this._trend = [];
    if (this._forecast.length) this._forecast = [];

    // Lazy-load the colour wheel only when a colour-capable light opens — it
    // stays out of the initial bundle path until first needed.
    if (this.entityId.startsWith("light.")) {
      const scm = this.hass.states[this.entityId]?.attributes.supported_color_modes as string[] | undefined;
      if (scm?.some((m) => ["hs", "xy", "rgb", "rgbw", "rgbww", "rgbwww"].includes(m))) {
        void import("../primitives/color-wheel.js");
      }
    }

    const histId = detailNeedsHistory(this.entityId, this.config);
    if (histId && this.hass.connected) {
      const pts = await fetchNumericHistory(this.hass, histId, 24);
      this._trend = pts.map((p) => p.value);
    }
    if (this.entityId && detailNeedsForecast(this.entityId) && this.hass.connected) {
      await this._loadForecast();
    }
  }

  private async _loadForecast() {
    if (!this.hass) return;
    const attr = this.hass.states[this.entityId]?.attributes.forecast as DetailContext["forecast"] | undefined;
    if (attr?.length) {
      this._forecast = attr.slice(0, 7);
      return;
    }
    try {
      const res = await this.hass.callWS<{ response: Record<string, { forecast: DetailContext["forecast"] }> }>({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: this.entityId },
        return_response: true,
      });
      this._forecast = (res?.response?.[this.entityId]?.forecast ?? []).slice(0, 7);
    } catch {
      this._forecast = [];
    }
  }

  private _call = async (call: ServiceCall, verb = "update"): Promise<void> => {
    if (!this.hass) return;
    try {
      await execute(this.hass, call);
    } catch {
      toast(this, { message: `Couldn't ${verb} ${this._name}`, tone: "alert", icon: "mdi:alert-circle-outline" });
    }
  };

  private get _name(): string {
    return this.config?.name ?? this.hass?.states[this.entityId]?.attributes.friendly_name ?? this.entityId;
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("hd-detail-close", { bubbles: true, composed: true }));
  }

  render() {
    // Entityless detail (energy / powerflow) has no entityId but does have a
    // config; only bail when we have neither.
    if (!this.hass || (!this.entityId && !this.config)) {
      return html`<hd-surface .open=${this.open} @hd-close=${() => this._close()}></hd-surface>`;
    }
    const vm = normalizeEntity(this.hass, this.entityId, this.config);
    const ctx: DetailContext = {
      hass: this.hass,
      entityId: this.entityId,
      config: this.config,
      host: this,
      trend: this._trend,
      forecast: this._forecast,
      call: this._call,
    };
    const subheading =
      this.config?.type === "energy"
        ? "Live energy"
        : this.config?.type === "powerflow"
          ? "Live power flow"
          : vm.displayState;
    const definition = this.config ? widgetDefinition(this.config.type) : undefined;
    const state = this.hass.states[this.entityId];
    const body = this.open && definition?.detailRenderer && state
      ? renderDefinedDetail(definition.detailRenderer, ctx, state)
      : this.open
        ? renderDetailBody(ctx)
        : nothing;
    return html`
      <hd-surface
        variant="auto"
        .open=${this.open}
        .heading=${this._name}
        .subheading=${subheading}
        @hd-close=${() => this._close()}
      >
        ${body}
      </hd-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-detail": HdDetail;
  }
}
