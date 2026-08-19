import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { fanCaps } from "../home-assistant/capabilities.js";
import { buildFanPercentage } from "../home-assistant/service-calls.js";
import { requestConfirm } from "../primitives/feedback.js";
import { titleCase } from "../home-assistant/state-formatting.js";
import "./widget-frame.js";
import "../primitives/slider.js";
import "../primitives/icon-button.js";

// ---- Fan -----------------------------------------------------------------
@define("hd-widget-fan")
export class FanWidget extends EntityWidget {
  private _debounce = 0;
  static styles = css`
    .vert {
      flex: 1;
      min-height: 120px;
    }
  `;
  private _setPct(pct: number, final: boolean) {
    window.clearTimeout(this._debounce);
    const send = () => this.entityId && this.callService(buildFanPercentage(this.entityId, pct), { errorVerb: "set speed for" });
    if (final) send();
    else this._debounce = window.setTimeout(send, 200);
  }
  renderContent() {
    const vm = this.vm;
    const caps = fanCaps(vm.stateObj);
    const size = this.currentSize;
    const vertical = size === "1x2";
    const showSlider = caps.speed && (size === "2x1" || size === "1x2") && vm.active;
    const pct = (vm.stateObj?.attributes.percentage as number) ?? 0;
    return html`<hd-widget-frame
      .icon=${vm.icon}
      .name=${vm.name}
      .stateText=${vm.displayState}
      .secondary=${vm.secondary ?? ""}
      .size=${size}
      .accent=${vm.accent}
      .active=${vm.active}
      .unavailable=${!vm.available}
      .hasDetail=${true}
      .quickKind=${"toggle"}
      .quickLabel=${vm.quickAction.label}
      .actionState=${this.actionState}
      @hd-quick=${() => this.runQuick()}
      @hd-activate=${() => this.openDetail()}
    >
      ${showSlider
        ? html`<hd-slider
            class=${vertical ? "vert" : ""}
            .vertical=${vertical}
            .value=${pct}
            .valueText=${`${Math.round(pct)}%`}
            icon="mdi:fan"
            label=${`Speed of ${vm.name}`}
            @hd-input=${(e: CustomEvent) => this._setPct(e.detail.value, false)}
            @hd-change=${(e: CustomEvent) => this._setPct(e.detail.value, true)}
          ></hd-slider>`
        : nothing}
    </hd-widget-frame>`;
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._debounce);
  }
}

// ---- Camera --------------------------------------------------------------
@define("hd-widget-camera")
export class CameraWidget extends EntityWidget {
  @state() private _cacheBust = Date.now();
  private _timer = 0;
  static styles = css`
    .tile {
      position: relative;
      height: 100%;
      min-height: 120px;
      background: #0b0d10;
      display: grid;
      place-items: center;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .label {
      position: absolute;
      left: 12px;
      bottom: 10px;
      color: #fff;
      font: var(--text-secondary-state);
      font-weight: 650;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    }
    .off {
      color: var(--text-tertiary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
  `;
  connectedCallback(): void {
    super.connectedCallback();
    // Refresh the still every 10s only while mounted & visible.
    this._timer = window.setInterval(() => (this._cacheBust = Date.now()), 10000);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }
  renderContent() {
    const vm = this.vm;
    const pic = vm.stateObj?.attributes.entity_picture as string | undefined;
    const src = pic ? `${pic}${pic.includes("?") ? "&" : "?"}_=${this._cacheBust}` : undefined;
    return html`<hd-widget-frame
      bleed
      .name=${vm.name}
      .size=${this.currentSize}
      .accent=${"accent"}
      .hasDetail=${true}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      <div class="tile">
        ${src && vm.available
          ? html`<img src=${src} alt=${`Live view of ${vm.name}`} loading="lazy" />`
          : html`<div class="off"><hd-icon icon="mdi:cctv" .size=${34}></hd-icon><span>${vm.displayState}</span></div>`}
        <span class="label">${vm.name}</span>
      </div>
    </hd-widget-frame>`;
  }
}

// ---- Alarm control panel -------------------------------------------------
@define("hd-widget-alarm")
export class AlarmWidget extends EntityWidget {
  static styles = css`
    .controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      min-height: 44px;
      padding: 0 14px;
      border-radius: var(--radius-control);
      background: var(--surface-subtle);
      color: var(--text-primary);
      font: var(--text-secondary-state);
      font-weight: 650;
    }
    button.danger {
      background: var(--state-alert-soft);
      color: var(--state-alert);
    }
  `;
  private async _call(service: string, confirm: boolean) {
    if (!this.entityId || !this.hass) return;
    if (confirm) {
      const ok = await requestConfirm(this, { title: `${titleCase(service.replace("alarm_", "").replace("_", " "))}?`, confirmLabel: "Confirm", destructive: service === "alarm_disarm" });
      if (!ok) return;
    }
    void this.callService(
      { domain: "alarm_control_panel", service, data: { entity_id: this.entityId } },
      { errorVerb: "update" },
    );
  }
  renderContent() {
    const vm = this.vm;
    const st = vm.rawState;
    const accent = st === "triggered" ? "alert" : st.startsWith("armed") ? "warn" : st === "disarmed" ? "eco" : "accent";
    const size = this.currentSize;
    const armed = st !== "disarmed";
    return html`<hd-widget-frame
      .icon=${st === "triggered" ? "mdi:shield-alert" : armed ? "mdi:shield-home" : "mdi:shield-off"}
      .name=${vm.name}
      .stateText=${titleCase(st.replace("_", " "))}
      .size=${size}
      .accent=${accent}
      .active=${armed}
      .unavailable=${!vm.available}
      .hasDetail=${true}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      ${size !== "1x1"
        ? html`<div class="controls" @click=${(e: Event) => e.stopPropagation()}>
            ${armed
              ? html`<button class="danger" @click=${() => this._call("alarm_disarm", true)}>Disarm</button>`
              : html`<button @click=${() => this._call("alarm_arm_home", false)}>Arm home</button>
                  <button @click=${() => this._call("alarm_arm_away", false)}>Arm away</button>`}
          </div>`
        : nothing}
    </hd-widget-frame>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-fan": FanWidget;
    "hd-widget-camera": CameraWidget;
    "hd-widget-alarm": AlarmWidget;
  }
}
