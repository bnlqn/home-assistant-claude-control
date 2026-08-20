import { css, html, nothing } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { requestConfirm } from "../primitives/feedback.js";
import { titleCase } from "../home-assistant/state-formatting.js";
import "./widget-frame.js";

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
    "hd-widget-alarm": AlarmWidget;
  }
}
