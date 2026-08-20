import { html } from "lit";
import type { ActionWidgetOptions } from "../config/widget-options.js";
import { requestConfirm, toast } from "../primitives/feedback.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import "./widget-frame.js";

@define("hd-widget-action")
export class ActionWidget extends EntityWidget {
  private _actionResetTimer = 0;

  protected override hasDetail(): boolean {
    return false;
  }

  protected override relevantEntityIds(): string[] {
    return [];
  }

  private get _options(): ActionWidgetOptions | undefined {
    return this.config.type === "action" ? this.config.options : undefined;
  }

  private async _run() {
    const options = this._options;
    if (!options?.service || !this.hass) return;
    const [domain, service] = options.service.split(".");
    if (!domain || !service) return;
    if (this.config.requiresConfirmation) {
      const confirmed = await requestConfirm(this, {
        title: `${this.config.name ?? "Run"}?`,
        confirmLabel: this.config.name ?? "Run",
      });
      if (!confirmed) return;
    }
    this.actionState = "pending";
    try {
      await this.hass.callService(domain, service, options.data, options.target);
      this.actionState = "success";
      toast(this, { message: this.config.name ?? "Done", tone: "eco", icon: "mdi:check" });
    } catch {
      this.actionState = "error";
      toast(this, {
        message: `Couldn't run ${this.config.name ?? "action"}`,
        tone: "alert",
        icon: "mdi:alert-circle-outline",
      });
    } finally {
      window.clearTimeout(this._actionResetTimer);
      this._actionResetTimer = window.setTimeout(() => (this.actionState = "idle"), 850);
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._actionResetTimer);
  }

  renderContent() {
    const name = this.config.name ?? "Action";
    const icon = this.config.icon ?? "mdi:gesture-tap-button";
    return html`<hd-widget-frame
      .icon=${icon}
      .name=${name}
      .stateText=${"Tap to run"}
      .size=${this.currentSize}
      .layout=${this.layout}
      .accent=${"accent"}
      .active=${false}
      .hasDetail=${false}
      .quickKind=${"activate"}
      .quickLabel=${name}
      .actionState=${this.actionState}
      @hd-quick=${() => this._run()}
    ></hd-widget-frame>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-action": ActionWidget;
  }
}
