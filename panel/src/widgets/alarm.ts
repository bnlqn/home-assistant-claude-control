import { css, html, nothing } from "lit";
import { titleCase } from "../home-assistant/state-formatting.js";
import { requestConfirm } from "../primitives/feedback.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import "./widget-frame.js";

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
      const confirmed = await requestConfirm(this, {
        title: `${titleCase(service.replace("alarm_", "").replace("_", " "))}?`,
        confirmLabel: "Confirm",
        destructive: service === "alarm_disarm",
      });
      if (!confirmed) return;
    }
    void this.callService(
      { domain: "alarm_control_panel", service, data: { entity_id: this.entityId } },
      { errorVerb: "update" },
    );
  }

  renderContent() {
    const vm = this.vm;
    const state = vm.rawState;
    const accent = state === "triggered"
      ? "alert"
      : state.startsWith("armed")
        ? "warn"
        : state === "disarmed"
          ? "eco"
          : "accent";
    const armed = state !== "disarmed";
    return html`<hd-widget-frame
      .icon=${state === "triggered" ? "mdi:shield-alert" : armed ? "mdi:shield-home" : "mdi:shield-off"}
      .name=${vm.name}
      .stateText=${titleCase(state.replace("_", " "))}
      .size=${this.currentSize}
      .accent=${accent}
      .active=${armed}
      .unavailable=${!vm.available}
      .hasDetail=${true}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      ${this.currentSize !== "1x1"
        ? html`<div class="controls" @click=${(event: Event) => event.stopPropagation()}>
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
