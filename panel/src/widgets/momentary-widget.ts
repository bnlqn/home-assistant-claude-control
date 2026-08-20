import { html } from "lit";
import { requestConfirm, toast } from "../primitives/feedback.js";
import { EntityWidget } from "./base-widget.js";
import "./widget-frame.js";

/** Shared behavior for entity-backed scene, script, and button actions. */
export abstract class MomentaryWidget extends EntityWidget {
  protected override hasDetail(): boolean {
    return false;
  }

  protected async activate(): Promise<void> {
    const vm = this.vm;
    const quickAction = vm.quickAction;
    if (!quickAction.call || !this.isConnected2) return;
    if (quickAction.requiresConfirmation) {
      const confirmed = await requestConfirm(this, {
        title: `${quickAction.label} ${vm.name}?`,
        confirmLabel: quickAction.label,
      });
      if (!confirmed) return;
    }
    try {
      await this.callService(quickAction.call, { errorVerb: quickAction.label.toLowerCase() });
      toast(this, {
        message: `${vm.name} — ${quickAction.label.toLowerCase()}`,
        tone: "eco",
        icon: "mdi:check",
      });
    } catch {
      // EntityWidget already reports the failed service call.
    }
  }

  renderContent() {
    const vm = this.vm;
    return html`<hd-widget-frame
      .icon=${vm.icon}
      .name=${vm.name}
      .stateText=${vm.displayState}
      .size=${this.currentSize}
      .layout=${this.layout}
      .accent=${vm.accent}
      .active=${vm.active}
      .unavailable=${!vm.available}
      .hasDetail=${false}
      .quickKind=${"activate"}
      .quickLabel=${vm.quickAction.label}
      .actionState=${this.actionState}
      @hd-quick=${() => this.activate()}
    ></hd-widget-frame>`;
  }
}
