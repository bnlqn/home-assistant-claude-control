import { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types/hass.js";
import type { WidgetConfig, WidgetSize } from "../config/schema.js";
import type { ActionState } from "./widget-frame.js";
import { execute, type ServiceCall } from "../home-assistant/service-calls.js";
import { normalizeEntity, type EntityViewModel } from "../home-assistant/entity-adapters/index.js";
import { requestConfirm, toast } from "../primitives/feedback.js";

/**
 * Base class for every widget. Provides:
 *  - performance-gated updates (re-render only when a referenced entity's state
 *    object reference actually changes, or connectivity/size/config changes),
 *  - the normalized `EntityViewModel`,
 *  - quick-action orchestration with confirmation, optimistic feedback, error
 *    toast + revert, and
 *  - a uniform `openDetail()` that asks the shell to open the detail surface.
 */
export abstract class EntityWidget extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: WidgetConfig;
  /** Footprint resolved by the grid for the current breakpoint. */
  @property({ type: String }) currentSize: WidgetSize = "1x1";

  @state() protected actionState: ActionState = "idle";
  private _resetTimer = 0;

  get entityId(): string | undefined {
    return this.config?.entity;
  }

  get vm(): EntityViewModel {
    return normalizeEntity(this.hass, this.entityId, this.config);
  }

  get isConnected2(): boolean {
    return this.hass?.connected !== false;
  }

  /** Entities whose changes should trigger a re-render (override for composites). */
  protected relevantEntityIds(): string[] {
    return this.entityId ? [this.entityId] : [];
  }

  /** Whether this widget type offers a detail surface. */
  protected hasDetail(): boolean {
    return true;
  }

  protected override shouldUpdate(changed: Map<string, unknown>): boolean {
    // Any change other than a fresh hass object always renders.
    if (!(changed.size === 1 && changed.has("hass"))) return true;
    const prev = changed.get("hass") as HomeAssistant | undefined;
    if (!prev || !this.hass) return true;
    if (prev.connected !== this.hass.connected) return true;
    // Only render if one of our entities' state objects changed by reference.
    return this.relevantEntityIds().some((id) => prev.states[id] !== this.hass!.states[id]);
  }

  protected openDetail(): void {
    if (!this.hasDetail()) return;
    this.dispatchEvent(
      new CustomEvent("hd-open-detail", {
        detail: { entityId: this.entityId, config: this.config, type: this.config.type },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** Run the widget's default quick action (from the adapter). */
  protected async runQuick(): Promise<void> {
    const vm = this.vm;
    const qa = vm.quickAction;
    if (!this.isConnected2 || vm.isPlaceholder || !vm.exists) return;
    if (qa.kind === "none" || !qa.call) {
      if (this.hasDetail()) this.openDetail();
      return;
    }
    if (qa.requiresConfirmation) {
      const destructive = vm.domain === "lock" || vm.domain === "alarm_control_panel";
      const ok = await requestConfirm(this, {
        title: `${qa.label} ${vm.name}?`,
        confirmLabel: qa.label,
        destructive,
        icon: vm.icon,
      });
      if (!ok) return;
    }
    await this.callService(qa.call, { errorVerb: qa.label.toLowerCase() });
  }

  /**
   * Execute a service call with pending/success/error feedback. On failure,
   * surfaces a toast; callers that applied optimistic UI should revert in their
   * own catch (we re-throw the error to allow that).
   */
  protected async callService(
    call: ServiceCall,
    opts: { errorVerb?: string; silentSuccess?: boolean } = {},
  ): Promise<void> {
    if (!this.hass) return;
    window.clearTimeout(this._resetTimer);
    this.actionState = "pending";
    try {
      await execute(this.hass, call);
      this.actionState = "success";
    } catch (err) {
      this.actionState = "error";
      toast(this, {
        message: `Couldn't ${opts.errorVerb ?? "update"} ${this.vm.name}`,
        tone: "alert",
        icon: "mdi:alert-circle-outline",
      });
      this._scheduleReset();
      throw err;
    }
    this._scheduleReset();
  }

  private _scheduleReset() {
    this._resetTimer = window.setTimeout(() => {
      this.actionState = "idle";
    }, 850);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._resetTimer);
  }
}
