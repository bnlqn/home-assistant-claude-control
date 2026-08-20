import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "../types/hass.js";
import type { WidgetConfig, WidgetSize } from "../config/schema.js";
import type { ActionState } from "./widget-frame.js";
import { execute, type ServiceCall } from "../home-assistant/service-calls.js";
import { normalizeEntity, type EntityViewModel } from "../home-assistant/entity-adapters/index.js";
import { requestConfirm, toast } from "../primitives/feedback.js";
import "./widget-frame.js";
import { HassDependencyController } from "../controllers/hass-dependency-controller.js";
import { widgetDependencies } from "./widget-definition.js";
import type { DisplayProfile } from "../panel/layout.js";

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
  /**
   * Tile anatomy the widget's frame should adopt, set by the container section:
   * "tile" (Homey device square), "value" (read-only value tile), or "row"
   * (the default header card). Widgets forward this into `hd-widget-frame`.
   */
  @property({ type: String }) layout: "row" | "tile" | "value" = "row";
  /** Shape-aware profile resolved once by the panel and shared with all widgets. */
  @property({ attribute: false }) displayProfile: DisplayProfile = "desktop";

  @state() protected actionState: ActionState = "idle";
  private _resetTimer = 0;
  private readonly _hassDependencies = new HassDependencyController(this, () => this.relevantEntityIds());

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
    return this.config ? widgetDependencies(this.config) : [];
  }

  /** Whether this widget type offers a detail surface. */
  protected hasDetail(): boolean {
    return true;
  }

  protected override shouldUpdate(changed: Map<string, unknown>): boolean {
    // Any change other than a fresh hass object always renders.
    if (!(changed.size === 1 && changed.has("hass"))) return true;
    const prev = changed.get("hass") as HomeAssistant | undefined;
    return this._hassDependencies.hasChanged(prev, this.hass);
  }

  /**
   * Per-widget error boundary. Subclasses implement `renderContent()` instead of
   * `render()`; a throw in that content (a bad attribute, a divide-by-zero in a
   * custom SVG, an unexpected state shape) degrades this one tile to an error
   * card rather than propagating up and blanking the whole view. This is the
   * primary safety net for an always-on display; the grid adds a second net for
   * config/layout throws, and the panel root a best-effort backstop for async
   * throws neither boundary can see.
   */
  protected override render(): unknown {
    try {
      return this.renderContent();
    } catch (err) {
      const id = this.config?.id ?? this.config?.type ?? this.entityId ?? "?";
      console.error(`[hd-widget ${id}] render failed:`, err);
      return this._renderErrorTile();
    }
  }

  /** The widget's real render. Was `render()` before the boundary was added. */
  protected abstract renderContent(): unknown;

  /** Neutral, card-styled fallback shown when `renderContent()` throws. */
  private _renderErrorTile(): unknown {
    // Deliberately touches only plain config fields — never `vm`/normalizeEntity,
    // which could be the very thing that just threw.
    const name = this.config?.name || this.config?.entity || "Widget";
    return html`<hd-widget-frame
      icon="mdi:alert-circle-outline"
      .name=${name}
      stateText="Unavailable"
      secondary="Widget error"
      accent="alert"
      .size=${this.currentSize}
      ?unavailable=${true}
    ></hd-widget-frame>`;
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
