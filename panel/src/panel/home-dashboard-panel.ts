import { LitElement, css, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { designTokens, sharedA11y } from "../design-system/tokens.js";
import type { HomeAssistant, PanelInfo, Route } from "../types/hass.js";
import type { DashboardConfig, DisplayProfile, ViewConfig } from "../config/schema.js";
import { dashboardConfig } from "../config/dashboard.config.js";
import {
  dashboardConfigToDocument,
  dashboardDocumentToConfig,
  loadDashboardDocument,
  type DashboardDocumentV1,
} from "../config/dashboard-document.js";
import { validateConfig, type ValidationIssue } from "../config/validation.js";
import { navigate, pathForView, viewIdFromRoute } from "./router.js";
import type { HdAppShell, NavView } from "./app-shell.js";
import type { WidgetConfig } from "../config/schema.js";
import type { ConfirmOptions, ToastOptions } from "../primitives/feedback.js";

import "./app-shell.js";
import "./view-grid.js";
import "../details/detail-surface.js";
import "../primitives/confirm-dialog.js";
import "../primitives/toast.js";
import "../primitives/misc.js";
import type { HdConfirm } from "../primitives/confirm-dialog.js";
import type { HdToasts } from "../primitives/toast.js";
import { ResponsiveProfileController } from "../controllers/responsive-profile-controller.js";
import { EnergyPeriodController } from "../controllers/energy-period-controller.js";
import { resolveDisplayProfile } from "./layout.js";

type Appearance = "auto" | "light" | "dark";
const APPEARANCE_KEY = "hd-panel-appearance";

/**
 * Root custom-panel element. Receives the Home Assistant panel contract
 * (`hass`, `narrow`, `panel`, `route`), owns theme resolution, sub-routing,
 * versioned document loading, and the single detail/confirm/toast instances.
 * It is intentionally thin — all real UI lives in the shell, grid and widgets.
 */
@define("home-dashboard-panel")
export class HomeDashboardPanel extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: PanelInfo;
  @property({ attribute: false }) route?: Route;

  @state() private _viewId = "";
  @state() private _appearance: Appearance = "auto";
  @state() private _detailOpen = false;
  @state() private _detailEntityId = "";
  @state() private _detailConfig?: WidgetConfig;

  @query("hd-confirm") private _confirm?: HdConfirm;
  @query("hd-toasts") private _toasts?: HdToasts;

  private readonly _responsive = new ResponsiveProfileController(this, resolveDisplayProfile);
  private readonly _energyPeriod = new EnergyPeriodController(this);
  private _document?: { value: DashboardDocumentV1; issues: ValidationIssue[] };
  private readonly _resolvedConfigs = new Map<
    DisplayProfile,
    { config: DashboardConfig; issues: ValidationIssue[] }
  >();
  private _onPop = () => this._syncViewFromLocation();
  private _mqlDark?: MediaQueryList;
  private _onMqlChange = () => this._applyTheme();
  // Best-effort backstop: the widget and grid boundaries catch synchronous
  // render throws, but a throw inside a child element's own *async* update
  // (e.g. the inner flow diagram) surfaces here instead of being swallowed.
  // Log-only — tile attribution isn't possible at this level.
  private _onWindowError = (ev: ErrorEvent) => {
    // "ResizeObserver loop …" is a benign, self-correcting browser notice (fired
    // when an observer callback changes layout); it is not an application fault.
    // The text may arrive in `message` or `error` depending on the browser.
    const err = ev.error;
    const text = `${ev.message ?? ""} ${typeof err === "string" ? err : (err?.message ?? "")}`;
    if (text.includes("ResizeObserver loop")) return;
    console.error("[home-dashboard-panel] uncaught error:", err ?? ev.message);
  };
  private _onRejection = (ev: PromiseRejectionEvent) =>
    console.error("[home-dashboard-panel] unhandled rejection:", ev.reason);

  static styles = [
    designTokens,
    sharedA11y,
    css`
      :host {
        display: block;
        height: 100%;
        width: 100%;
        font-family: var(--font-sans);
        background: var(--canvas);
        color: var(--text-primary);
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
      }
      :host([data-kiosk]) {
        user-select: none;
        -webkit-user-select: none;
      }
      .loading {
        height: 100%;
        display: grid;
        place-items: center;
      }
      .cfg-errors {
        margin: 12px 24px 0;
        padding: 14px 16px;
        border-radius: var(--radius-control);
        background: var(--state-alert-soft);
        color: var(--state-alert);
        font: var(--text-secondary-state);
      }
      .cfg-errors strong {
        display: block;
        margin-bottom: 6px;
      }
      .cfg-errors ul {
        margin: 0;
        padding-left: 18px;
      }
      .cfg-errors code {
        font-family: ui-monospace, monospace;
      }
    `,
  ];

  // ---- Lifecycle ---------------------------------------------------------
  connectedCallback(): void {
    super.connectedCallback();
    this._appearance = (localStorage.getItem(APPEARANCE_KEY) as Appearance) || "auto";
    this._mqlDark = window.matchMedia("(prefers-color-scheme: dark)");
    this._mqlDark.addEventListener("change", this._onMqlChange);
    window.addEventListener("popstate", this._onPop);
    window.addEventListener("error", this._onWindowError);
    window.addEventListener("unhandledrejection", this._onRejection);
    this._syncViewFromLocation();
    this._applyTheme();
    this._applyKiosk();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mqlDark?.removeEventListener("change", this._onMqlChange);
    window.removeEventListener("popstate", this._onPop);
    window.removeEventListener("error", this._onWindowError);
    window.removeEventListener("unhandledrejection", this._onRejection);
  }

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has("route")) this._syncViewFromLocation();
    if (changed.has("hass") && this._appearance === "auto") this._applyTheme();
  }

  // ---- Config ------------------------------------------------------------
  private get _dashboardDocument(): { value: DashboardDocumentV1; issues: ValidationIssue[] } {
    if (!this._document) {
      // The checked-in TypeScript config is the legacy v0 source for now. It is
      // sanitized first, then immediately adapted into the same serializable
      // document contract future HA-backed persistence/imports will use.
      const legacy = validateConfig(dashboardConfig);
      const fallback = dashboardConfigToDocument(legacy.sanitized);
      const loaded = loadDashboardDocument(dashboardConfig, fallback);
      const issues = [...legacy.issues, ...loaded.issues];
      this._document = { value: loaded.document, issues };
      const errors = issues.filter((issue) => issue.level === "error");
      if (errors.length) {
        // Loud developer-facing signal; the UI also shows a banner.
        console.error("[home-dashboard-panel] Invalid dashboard document:", errors);
      }
    }
    return this._document;
  }

  private get _cfg(): { config: DashboardConfig; issues: ValidationIssue[] } {
    const profile = this._responsive.profile;
    const cached = this._resolvedConfigs.get(profile);
    if (cached) return cached;

    const source = this._dashboardDocument;
    const runtime = validateConfig(dashboardDocumentToConfig(source.value, profile));
    const resolved = {
      config: runtime.sanitized,
      issues: [...source.issues, ...runtime.issues],
    };
    this._resolvedConfigs.set(profile, resolved);
    return resolved;
  }

  private get _base(): string {
    return this.panel?.url_path ?? "home-dashboard";
  }

  private get _views(): ViewConfig[] {
    return this._cfg.config.views;
  }

  private get _navViews(): NavView[] {
    return this._views.map((v) => ({ id: v.id, label: v.label, icon: v.icon, type: v.type }));
  }

  private get _currentView(): ViewConfig | undefined {
    return this._views.find((v) => v.id === this._viewId) ?? this._views[0];
  }

  // ---- Routing -----------------------------------------------------------
  private _syncViewFromLocation() {
    const fromRoute = viewIdFromRoute(this.route, this._base);
    const wanted = fromRoute || this._cfg.config.defaultView;
    const exists = this._views.some((v) => v.id === wanted);
    this._viewId = exists ? wanted : this._cfg.config.defaultView;
  }

  private _onNavigate(viewId: string) {
    if (viewId === this._viewId) return;
    this._viewId = viewId;
    navigate(pathForView(this._base, viewId, this._cfg.config.defaultView));
    // The scroll container lives inside the shell's shadow root. Wait for the
    // new view to render, then ask the owning component to reset it.
    void this.updateComplete.then(() =>
      this.renderRoot.querySelector<HdAppShell>("hd-app-shell")?.scrollToTop(),
    );
  }

  // ---- Theme -------------------------------------------------------------
  private _resolveDark(): boolean {
    if (this._appearance === "dark") return true;
    if (this._appearance === "light") return false;
    if (this.hass?.themes?.darkMode != null) return !!this.hass.themes.darkMode;
    return !!this._mqlDark?.matches;
  }

  private _applyTheme() {
    this.setAttribute("data-theme", this._resolveDark() ? "dark" : "light");
  }

  private _cycleAppearance() {
    this._appearance = this._appearance === "auto" ? "light" : this._appearance === "light" ? "dark" : "auto";
    localStorage.setItem(APPEARANCE_KEY, this._appearance);
    this._applyTheme();
  }

  private _applyKiosk() {
    if (this._cfg.config.kiosk?.enabled && this._cfg.config.kiosk.preventScreenSelection) {
      this.setAttribute("data-kiosk", "");
    }
  }

  // ---- Event bus ---------------------------------------------------------
  private _onOpenDetail(e: CustomEvent) {
    this._detailEntityId = e.detail.entityId ?? "";
    this._detailConfig = e.detail.config;
    this._detailOpen = true;
  }
  private _onConfirm(e: CustomEvent<{ opts: ConfirmOptions; resolve: (v: boolean) => void }>) {
    e.stopPropagation();
    if (this._confirm) this._confirm.ask(e.detail.opts).then(e.detail.resolve);
    else e.detail.resolve(false);
  }
  private _onToast(e: CustomEvent<ToastOptions>) {
    e.stopPropagation();
    this._toasts?.show(e.detail);
  }

  render() {
    if (!this.hass) {
      return html`<div class="loading"><hd-skeleton w="220px" h="26px"></hd-skeleton></div>`;
    }
    const errors = this._cfg.issues.filter((i) => i.level === "error");
    const view = this._currentView;

    return html`
      <hd-app-shell
        .displayProfile=${this._responsive.profile}
        .views=${this._navViews}
        .currentViewId=${view?.id ?? ""}
        .productTitle=${this._cfg.config.title ?? "Home"}
        .subtitle=${view?.subtitle ?? ""}
        .connected=${this.hass.connected !== false}
        .appearance=${this._appearance}
        @hd-navigate=${(e: CustomEvent) => this._onNavigate(e.detail.viewId)}
        @hd-toggle-appearance=${() => this._cycleAppearance()}
        @hd-open-detail=${(e: CustomEvent) => this._onOpenDetail(e)}
        @hd-confirm=${(e: CustomEvent) => this._onConfirm(e as CustomEvent)}
        @hd-toast=${(e: CustomEvent) => this._onToast(e as CustomEvent)}
      >
        ${errors.length
          ? html`<div class="cfg-errors" role="alert">
              <strong>Dashboard configuration has ${errors.length} error(s):</strong>
              <ul>
                ${errors.slice(0, 8).map((i) => html`<li><code>${i.path}</code> — ${i.message}</li>`)}
              </ul>
            </div>`
          : nothing}
        <hd-view-grid
          .hass=${this.hass}
          .view=${view}
          .displayProfile=${this._responsive.profile}
          .energySelection=${this._energyPeriod.selection}
        ></hd-view-grid>
      </hd-app-shell>

      <hd-detail
        .hass=${this.hass}
        .open=${this._detailOpen}
        .entityId=${this._detailEntityId}
        .config=${this._detailConfig}
        @hd-detail-close=${() => (this._detailOpen = false)}
      ></hd-detail>

      <hd-confirm></hd-confirm>
      <hd-toasts></hd-toasts>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "home-dashboard-panel": HomeDashboardPanel;
  }
}
