import { html } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { requestConfirm, toast } from "../primitives/feedback.js";
import "./widget-frame.js";

/** Shared frame render for a plain, non-composite widget. */
function frame(w: EntityWidget, opts: { quickKind: "toggle" | "activate" | "none"; hasDetail: boolean }) {
  const vm = w.vm;
  return html`<hd-widget-frame
    .icon=${vm.icon}
    .name=${vm.name}
    .stateText=${vm.displayState}
    .secondary=${vm.secondary ?? ""}
    .size=${(w as unknown as { currentSize: string }).currentSize as never}
    .accent=${vm.accent}
    .active=${vm.active}
    .unavailable=${!vm.available}
    .hasDetail=${opts.hasDetail}
    .quickKind=${opts.quickKind}
    .quickLabel=${vm.quickAction.label}
    .actionState=${(w as unknown as { actionState: string }).actionState as never}
    @hd-quick=${() => (w as unknown as { runQuick(): void }).runQuick()}
    @hd-activate=${() => (w as unknown as { openDetail(): void }).openDetail()}
  ></hd-widget-frame>`;
}

// ---- Switch / plug -------------------------------------------------------
@define("hd-widget-switch")
export class SwitchWidget extends EntityWidget {
  renderContent() {
    return frame(this, { quickKind: "toggle", hasDetail: true });
  }
}

// ---- Lock ----------------------------------------------------------------
@define("hd-widget-lock")
export class LockWidget extends EntityWidget {
  renderContent() {
    return frame(this, { quickKind: "toggle", hasDetail: true });
  }
}

// ---- Person / presence ---------------------------------------------------
@define("hd-widget-person")
export class PersonWidget extends EntityWidget {
  renderContent() {
    return frame(this, { quickKind: "none", hasDetail: true });
  }
}

// ---- Binary sensor -------------------------------------------------------
@define("hd-widget-binary")
export class BinaryWidget extends EntityWidget {
  renderContent() {
    return frame(this, { quickKind: "none", hasDetail: true });
  }
}

/** Momentary tiles (scene / script / button) — whole tile activates. */
abstract class MomentaryWidget extends EntityWidget {
  protected override hasDetail(): boolean {
    return false;
  }
  protected async activate(): Promise<void> {
    const vm = this.vm;
    const qa = vm.quickAction;
    if (!qa.call || !this.isConnected2) return;
    if (qa.requiresConfirmation) {
      const ok = await requestConfirm(this, { title: `${qa.label} ${vm.name}?`, confirmLabel: qa.label });
      if (!ok) return;
    }
    try {
      await this.callService(qa.call, { errorVerb: qa.label.toLowerCase() });
      toast(this, { message: `${vm.name} — ${qa.label.toLowerCase()}`, tone: "eco", icon: "mdi:check" });
    } catch {
      /* base already toasted the failure */
    }
  }
  renderContent() {
    const vm = this.vm;
    return html`<hd-widget-frame
      .icon=${vm.icon}
      .name=${vm.name}
      .stateText=${vm.displayState}
      .size=${this.currentSize}
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

@define("hd-widget-scene")
export class SceneWidget extends MomentaryWidget {}

@define("hd-widget-script")
export class ScriptWidget extends MomentaryWidget {}

@define("hd-widget-button")
export class ButtonWidget extends MomentaryWidget {}

/**
 * Entityless action tile. Reads `options.service` ("domain.service"),
 * `options.data`, `options.target`. Great for "All lights off", "Goodnight",
 * whole-home routines. Confirms when `requiresConfirmation` is set.
 */
@define("hd-widget-action")
export class ActionWidget extends EntityWidget {
  protected override hasDetail(): boolean {
    return false;
  }
  protected override relevantEntityIds(): string[] {
    return [];
  }

  private async _run() {
    const opts = (this.config.options ?? {}) as {
      service?: string;
      data?: Record<string, unknown>;
      target?: Record<string, unknown>;
    };
    if (!opts.service || !this.hass) return;
    const [domain, service] = opts.service.split(".");
    if (!domain || !service) return;
    if (this.config.requiresConfirmation) {
      const ok = await requestConfirm(this, {
        title: `${this.config.name ?? "Run"}?`,
        confirmLabel: this.config.name ?? "Run",
      });
      if (!ok) return;
    }
    this.actionState = "pending";
    try {
      await this.hass.callService(domain, service, { ...(opts.data ?? {}), ...(opts.target ?? {}) });
      this.actionState = "success";
      toast(this, { message: `${this.config.name ?? "Done"}`, tone: "eco", icon: "mdi:check" });
    } catch {
      this.actionState = "error";
      toast(this, { message: `Couldn't run ${this.config.name ?? "action"}`, tone: "alert", icon: "mdi:alert-circle-outline" });
    } finally {
      window.setTimeout(() => (this.actionState = "idle"), 850);
    }
  }

  renderContent() {
    const name = this.config.name ?? "Action";
    const icon = this.config.icon ?? "mdi:gesture-tap-button";
    return html`<hd-widget-frame
      .icon=${icon}
      .name=${name}
      .stateText=${"Tap to run"}
      .size=${this.currentSize}
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
    "hd-widget-switch": SwitchWidget;
    "hd-widget-lock": LockWidget;
    "hd-widget-person": PersonWidget;
    "hd-widget-binary": BinaryWidget;
    "hd-widget-scene": SceneWidget;
    "hd-widget-script": ScriptWidget;
    "hd-widget-button": ButtonWidget;
    "hd-widget-action": ActionWidget;
  }
}
