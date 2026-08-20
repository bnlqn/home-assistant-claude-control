import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import type { ViewConfig } from "../config/schema.js";
import { ResponsiveProfileController } from "../controllers/responsive-profile-controller.js";
import "../primitives/entity-icon.js";
import "../primitives/icon-button.js";
import "../primitives/surface.js";

export interface NavView {
  id: string;
  label: string;
  icon: string;
  type: ViewConfig["type"];
}

type ShellMode = "sidebar" | "rail" | "compact";

const shellModeForWidth = (width: number): ShellMode =>
  width >= 1000 ? "sidebar" : width >= 720 ? "rail" : "compact";

/**
 * The application shell: navigation, the current view title, connectivity, and
 * the appearance toggle. It is NOT a widget and deliberately looks nothing like
 * one. Layout adapts to the panel's measured width:
 *   compact (phone)  → sticky top bar + bottom-sheet room switcher
 *   rail (tablet)    → slim icon rail
 *   sidebar (desktop)→ restrained labelled sidebar
 * The widget canvas is projected through the default slot and stays dominant.
 */
@define("hd-app-shell")
export class HdAppShell extends LitElement {
  @property({ attribute: false }) views: NavView[] = [];
  @property({ type: String }) currentViewId = "";
  @property({ type: String }) productTitle = "Home";
  @property({ type: String }) subtitle = "";
  @property({ type: Boolean }) connected = true;
  @property({ type: String }) appearance: "auto" | "light" | "dark" = "auto";

  @state() private _switcherOpen = false;
  private readonly _responsive = new ResponsiveProfileController(this, shellModeForWidth);

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .shell {
      display: grid;
      height: 100%;
      background: var(--canvas);
      color: var(--text-primary);
    }
    .shell[data-mode="sidebar"] {
      grid-template-columns: 248px 1fr;
    }
    .shell[data-mode="rail"] {
      grid-template-columns: 76px 1fr;
    }
    .shell[data-mode="compact"] {
      grid-template-columns: 1fr;
    }

    /* ---- Sidebar / rail ---- */
    nav.side {
      border-right: 1px solid var(--border-subtle);
      background: var(--surface);
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 18px 12px;
      overflow-y: auto;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 10px 16px;
    }
    .brand .logo {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--accent);
      color: var(--text-on-accent);
      display: grid;
      place-items: center;
      flex: none;
    }
    .brand .name {
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 17px;
      color: var(--text-primary);
    }
    .shell[data-mode="rail"] .brand {
      justify-content: center;
      padding: 6px 0 16px;
    }
    .shell[data-mode="rail"] .brand .name {
      display: none;
    }

    .navitem {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 12px;
      border-radius: var(--radius-control);
      color: var(--text-secondary);
      font: var(--text-widget-title);
      font-weight: 600;
      min-height: 44px;
      text-align: left;
      width: 100%;
      transition: background var(--motion-press) var(--ease-standard), color var(--motion-press) var(--ease-standard);
    }
    .navitem:hover {
      background: var(--surface-hover);
      color: var(--text-primary);
    }
    .navitem[aria-current="page"] {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .navitem .lbl {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shell[data-mode="rail"] .navitem {
      justify-content: center;
      padding: 11px 0;
    }
    .shell[data-mode="rail"] .navitem .lbl {
      display: none;
    }
    .navitem:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .navspacer {
      flex: 1;
    }
    .navsection {
      font: var(--text-meta);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 14px 12px 4px;
    }
    .shell[data-mode="rail"] .navsection {
      text-align: center;
      padding: 12px 0 4px;
      font-size: 9px;
    }

    /* ---- Main ---- */
    .main {
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100%;
      overflow: hidden;
    }
    header.topbar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 24px 8px;
      flex: none;
    }
    .shell[data-mode="compact"] header.topbar {
      padding: calc(env(safe-area-inset-top, 0px) + 12px) 16px 8px;
      position: sticky;
      top: 0;
      background: color-mix(in srgb, var(--canvas) 88%, transparent);
      backdrop-filter: saturate(1.2) blur(8px);
      z-index: 5;
    }
    .titles {
      flex: 1;
      min-width: 0;
    }
    .titles h1 {
      margin: 0;
      font: var(--text-view-title);
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .titles p {
      margin: 2px 0 0;
      font: var(--text-secondary-state);
      color: var(--text-secondary);
    }
    .switcher {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 8px 6px 4px;
      border-radius: var(--radius-pill);
      color: var(--text-primary);
      min-height: 44px;
    }
    .switcher .cur {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .switcher .cur .rn {
      font: var(--text-view-title);
      font-size: 24px;
    }
    .switcher:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: none;
    }
    .content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: env(safe-area-inset-bottom, 0px);
    }

    .offline {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 24px;
      padding: 10px 14px;
      border-radius: var(--radius-control);
      background: var(--state-warn-soft);
      color: var(--state-warn);
      font: var(--text-secondary-state);
      font-weight: 600;
    }
    .shell[data-mode="compact"] .offline {
      margin: 0 16px;
    }

    /* ---- Bottom-sheet switcher list ---- */
    .sheet-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .sheet-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 12px;
      border-radius: var(--radius-control);
      border: none;
      background: transparent;
      color: var(--text-primary);
      font: var(--text-widget-title);
      font-weight: 600;
      cursor: pointer;
      min-height: 52px;
      text-align: left;
      width: 100%;
    }
    .sheet-item[aria-current="page"] {
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .sheet-item .ic {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-icon);
      display: grid;
      place-items: center;
      background: var(--surface-subtle);
      flex: none;
    }
    .sheet-item[aria-current="page"] .ic {
      background: var(--surface);
    }
  `;

  private get _mode(): ShellMode {
    return this._responsive.profile;
  }

  private _navigate(id: string) {
    this._switcherOpen = false;
    this.dispatchEvent(new CustomEvent("hd-navigate", { detail: { viewId: id }, bubbles: true, composed: true }));
  }

  private _cycleAppearance() {
    this.dispatchEvent(new CustomEvent("hd-toggle-appearance", { bubbles: true, composed: true }));
  }

  private get _current(): NavView | undefined {
    return this.views.find((v) => v.id === this.currentViewId) ?? this.views[0];
  }

  /** Reset the view canvas owned by this shell after an in-panel navigation. */
  scrollToTop(): void {
    this.renderRoot.querySelector<HTMLElement>(".content")?.scrollTo({ top: 0 });
  }

  private _appearanceIcon(): string {
    return this.appearance === "dark" ? "mdi:weather-night" : this.appearance === "light" ? "mdi:weather-sunny" : "mdi:theme-light-dark";
  }

  private _renderNav() {
    const rooms = this.views.filter((v) => v.type === "room");
    const others = this.views.filter((v) => v.type !== "room");
    const item = (v: NavView) => html`
      <button
        class="navitem"
        aria-current=${v.id === this.currentViewId ? "page" : "false"}
        title=${v.label}
        @click=${() => this._navigate(v.id)}
      >
        <hd-icon .icon=${v.icon} .size=${22}></hd-icon>
        <span class="lbl">${v.label}</span>
      </button>
    `;
    return html`
      <nav class="side" aria-label="Views">
        <div class="brand">
          <span class="logo"><hd-icon icon="mdi:home-variant" .size=${20}></hd-icon></span>
          <span class="name">${this.productTitle}</span>
        </div>
        ${others.filter((v) => v.type === "overview").map(item)}
        ${rooms.length ? html`<div class="navsection">Rooms</div>` : nothing}
        ${rooms.map(item)}
        ${others.filter((v) => v.type === "system").length
          ? html`<div class="navsection">System</div>`
          : nothing}
        ${others.filter((v) => v.type === "system").map(item)}
        <div class="navspacer"></div>
        <button class="navitem" @click=${() => this._cycleAppearance()} title="Appearance">
          <hd-icon .icon=${this._appearanceIcon()} .size=${22}></hd-icon>
          <span class="lbl">Appearance</span>
        </button>
      </nav>
    `;
  }

  render() {
    const cur = this._current;
    const compact = this._mode === "compact";
    return html`
      <div class="shell" data-mode=${this._mode}>
        ${compact ? nothing : this._renderNav()}
        <div class="main">
          <header class="topbar">
            ${compact
              ? html`<button class="switcher" @click=${() => (this._switcherOpen = true)} aria-haspopup="dialog">
                    <span class="cur">
                      <hd-icon .icon=${cur?.icon ?? "mdi:home"} .size=${24}></hd-icon>
                      <span class="rn">${cur?.label ?? this.productTitle}</span>
                    </span>
                    <hd-icon icon="mdi:chevron-down" .size=${22}></hd-icon>
                  </button>`
              : html`<div class="titles">
                    <h1>${cur?.label ?? this.productTitle}</h1>
                    ${this.subtitle ? html`<p>${this.subtitle}</p>` : nothing}
                  </div>`}
            <div class="actions">
              ${!this.connected
                ? html`<hd-icon title="Offline" icon="mdi:wifi-off" .size=${20} style="color:var(--state-warn)"></hd-icon>`
                : nothing}
              ${compact
                ? html`<hd-icon-button
                    .icon=${this._appearanceIcon()}
                    label="Appearance"
                    variant="soft"
                    @click=${() => this._cycleAppearance()}
                  ></hd-icon-button>`
                : nothing}
            </div>
          </header>

          ${!this.connected
            ? html`<div class="offline" role="status">
                <hd-icon icon="mdi:wifi-off" .size=${16}></hd-icon>
                Offline — showing last known values. Controls are paused.
              </div>`
            : nothing}

          <div class="content"><slot></slot></div>
        </div>
      </div>

      <hd-surface
        variant="sheet"
        heading="Go to"
        ?open=${this._switcherOpen}
        @hd-close=${() => (this._switcherOpen = false)}
      >
        <div class="sheet-list">
          ${this.views.map(
            (v) => html`<button
              class="sheet-item"
              aria-current=${v.id === this.currentViewId ? "page" : "false"}
              @click=${() => this._navigate(v.id)}
            >
              <span class="ic"><hd-icon .icon=${v.icon} .size=${22}></hd-icon></span>
              <span>${v.label}</span>
            </button>`,
          )}
        </div>
      </hd-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-app-shell": HdAppShell;
  }
}
