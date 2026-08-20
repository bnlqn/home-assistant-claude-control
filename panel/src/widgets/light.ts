import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { lightCaps } from "../home-assistant/capabilities.js";
import { buildLightBrightness, buildLightTurnOn } from "../home-assistant/service-calls.js";
import "./widget-frame.js";
import "../primitives/slider.js";

/**
 * Light widget. Glanceable at 1×1; reveals a brightness bar at 2×1 / 1×2 and a
 * brightness + color-temperature pair at 2×2 — but only for capabilities the
 * light actually advertises. Sliders are debounced during drag and send a
 * final precise value on release; brightness is applied optimistically and
 * reconciled against live state.
 */
@define("hd-widget-light")
export class LightWidget extends EntityWidget {
  @state() private _optimistic: number | null = null;
  private _optimisticTs = 0;
  private _debounce = 0;

  static styles = css`
    .col {
      display: flex;
      flex-direction: column;
      gap: 12px;
      height: 100%;
    }
    .vert {
      flex: 1;
      min-height: 120px;
    }
    .temp-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .temp-label {
      font: var(--text-meta);
      color: var(--text-tertiary);
      flex: none;
    }
  `;

  private get _displayLevel(): number {
    const vm = this.vm;
    const live = vm.level ?? (vm.active ? 100 : 0);
    if (this._optimistic != null) {
      // Reconcile: drop optimistic once live catches up or after a grace period.
      if (Math.abs(live - this._optimistic) <= 3 || Date.now() - this._optimisticTs > 1600) {
        this._optimistic = null;
        return live;
      }
      return this._optimistic;
    }
    return live;
  }

  private _onInput(pct: number) {
    this._optimistic = pct;
    this._optimisticTs = Date.now();
    window.clearTimeout(this._debounce);
    this._debounce = window.setTimeout(() => {
      if (this.entityId) void this.callService(buildLightBrightness(this.entityId, pct), { errorVerb: "dim" });
    }, 180);
  }

  private _onChange(pct: number) {
    this._optimistic = pct;
    this._optimisticTs = Date.now();
    window.clearTimeout(this._debounce);
    if (this.entityId) void this.callService(buildLightBrightness(this.entityId, pct), { errorVerb: "dim" });
  }

  private _onTemp(kelvin: number) {
    if (this.entityId) void this.callService(buildLightTurnOn(this.entityId, { colorTempKelvin: kelvin }), {
      errorVerb: "set color of",
    });
  }

  private _renderBrightness(vertical: boolean) {
    const vm = this.vm;
    const level = this._displayLevel;
    const disabled = !vm.available || !vm.active;
    return html`<hd-slider
      class=${vertical ? "vert" : ""}
      .vertical=${vertical}
      .value=${level}
      .min=${1}
      .max=${100}
      .step=${1}
      .disabled=${disabled}
      .valueText=${vm.active ? `${Math.round(level)}%` : "Off"}
      .icon=${"mdi:brightness-6"}
      .color=${vm.rgbCss || "var(--state-light)"}
      label=${`Brightness of ${vm.name}`}
      @hd-input=${(e: CustomEvent) => this._onInput(e.detail.value)}
      @hd-change=${(e: CustomEvent) => this._onChange(e.detail.value)}
    ></hd-slider>`;
  }

  private _renderTemp() {
    const vm = this.vm;
    const s = vm.stateObj;
    const min = (s?.attributes.min_color_temp_kelvin as number) ?? 2200;
    const max = (s?.attributes.max_color_temp_kelvin as number) ?? 6500;
    const cur = (s?.attributes.color_temp_kelvin as number) ?? Math.round((min + max) / 2);
    return html`<div class="temp-row">
      <span class="temp-label">Warm</span>
      <hd-slider
        style="flex:1"
        .value=${cur}
        .min=${min}
        .max=${max}
        .step=${50}
        .disabled=${!vm.active}
        .color=${"linear-gradient(90deg,#ffb85c,#fff5e8)"}
        label=${`Color temperature of ${vm.name}`}
        @hd-change=${(e: CustomEvent) => this._onTemp(e.detail.value)}
      ></hd-slider>
      <span class="temp-label">Cool</span>
    </div>`;
  }

  renderContent() {
    const vm = this.vm;
    const caps = lightCaps(vm.stateObj);
    const size = this.currentSize;
    const showBrightness = caps.brightness && (size === "2x1" || size === "1x2" || size === "2x2");
    const vertical = size === "1x2";
    const showTemp = caps.colorTemp && size === "2x2";

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .layout=${this.layout}
        .name=${vm.name}
        .stateText=${vm.displayState}
        .size=${size}
        .accent=${vm.accent}
        .glyphColor=${vm.rgbCss || ""}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"toggle"}
        .quickLabel=${vm.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${showBrightness
          ? html`<div class="col">
              ${vertical ? this._renderBrightness(true) : nothing}
              ${!vertical ? this._renderBrightness(false) : nothing}
              ${showTemp ? this._renderTemp() : nothing}
            </div>`
          : nothing}
      </hd-widget-frame>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._debounce);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-light": LightWidget;
  }
}
