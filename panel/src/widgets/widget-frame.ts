import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import type { WidgetSize } from "../config/schema.js";
import type { AccentToken } from "../home-assistant/entity-adapters/index.js";
import { accentVars } from "../home-assistant/entity-adapters/index.js";
import "../primitives/entity-icon.js";

export type ActionState = "idle" | "pending" | "success" | "error";

/**
 * The one and only widget card. Every widget renders inside this frame — there
 * is never a card nested in a card. It standardizes the widget anatomy and,
 * crucially, keeps interaction unambiguous:
 *
 *   • the ICON is the quick-action target (toggle / activate),
 *   • the TITLE block + surrounding card body opens the detail surface
 *     (or, for a detail-less momentary tile, performs the action),
 *   • slotted CONTROLS own their own events and never open the detail.
 *
 * Keyboard users get two explicit targets (icon button + title button); mouse/
 * touch users can also tap anywhere on the non-control body.
 */
@define("hd-widget-frame")
export class HdWidgetFrame extends LitElement {
  @property({ type: String }) icon = "";
  @property({ type: String }) name = "";
  @property({ type: String }) stateText = "";
  @property({ type: String }) secondary = "";
  @property({ type: String }) size: WidgetSize = "1x1";
  @property({ type: String }) accent: AccentToken = "idle";
  @property({ type: String }) glyphColor = "";
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) unavailable = false;
  @property({ type: Boolean }) hasDetail = false;
  @property({ type: String }) quickKind: "toggle" | "activate" | "none" = "none";
  @property({ type: String }) quickLabel = "";
  @property({ type: String }) actionState: ActionState = "idle";
  @property({ type: Boolean }) bleed = false;
  /**
   * Tile anatomy:
   *  - "row"   → header card (icon + titles at the top). The default.
   *  - "tile"  → Homey device square: icon top-left, status accessory
   *              top-right (the `badge` slot, else an active dot), name bottom.
   *  - "value" → read-only value tile: label, big value, right-hand icon circle.
   */
  @property({ type: String }) layout: "row" | "tile" | "value" = "row";

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .card {
      position: relative;
      height: 100%;
      box-sizing: border-box;
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: var(--pad, 16px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
      transition: box-shadow var(--motion-state) var(--ease-standard);
      isolation: isolate;
    }
    .card[data-clickable="true"] {
      cursor: pointer;
    }
    :host([active]) .card {
      box-shadow: var(--shadow-widget), inset 0 0 0 1.5px var(--accent-ring, transparent);
    }
    .card.bleed {
      padding: 0;
      gap: 0;
    }
    :host([data-size="1x1"]) .card {
      --pad: 14px;
    }
    :host([data-size="2x1"]) .card,
    :host([data-size="1x2"]) .card {
      --pad: 17px;
    }
    :host([data-size="2x2"]) .card {
      --pad: 21px;
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .icon-btn {
      -webkit-tap-highlight-color: transparent;
      flex: none;
      appearance: none;
      border: none;
      cursor: pointer;
      width: 46px;
      height: 46px;
      min-width: 44px;
      min-height: 44px;
      border-radius: var(--radius-icon);
      display: grid;
      place-items: center;
      background: var(--icon-bg, var(--idle-bg));
      color: var(--icon-fg, var(--idle-fg));
      transition: background var(--motion-state) var(--ease-standard),
        color var(--motion-state) var(--ease-standard), transform var(--motion-press) var(--ease-standard);
    }
    .icon-btn[data-interactive="true"]:active {
      transform: scale(0.9);
    }
    .icon-btn[data-interactive="false"] {
      cursor: default;
    }
    .icon-btn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .icon-btn.pending {
      animation: pulse 1s ease-in-out infinite;
    }
    .icon-btn.success {
      --icon-bg: var(--state-eco-soft);
      --icon-fg: var(--state-eco);
    }
    .icon-btn.error {
      --icon-bg: var(--state-alert-soft);
      --icon-fg: var(--state-alert);
    }
    @keyframes pulse {
      50% {
        opacity: 0.55;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .icon-btn.pending {
        animation: none;
        opacity: 0.7;
      }
      .icon-btn[data-interactive="true"]:active {
        transform: none;
      }
    }

    .titles {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      background: none;
      text-align: left;
      padding: 2px 0 0;
      margin: 0;
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      color: inherit;
      border-radius: 8px;
    }
    button.titles {
      cursor: pointer;
    }
    button.titles:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .name {
      font: var(--text-widget-title);
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state {
      font: var(--text-secondary-state);
      color: var(--state-color, var(--text-secondary));
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .secondary {
      font: var(--text-meta);
      color: var(--text-tertiary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .badge {
      flex: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chev {
      color: var(--text-tertiary);
      opacity: 0.7;
    }
    .body {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 10px;
    }
    :host([data-size="1x1"]) .body {
      gap: 6px;
    }
    :host([unavailable]) .card {
      opacity: 0.72;
    }
    ::slotted(*) {
      min-width: 0;
    }

    /* ---- Homey device tile: icon TL · accessory TR · name at the bottom ---- */
    .card.tile {
      justify-content: space-between;
      gap: 10px;
    }
    .tile-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }
    .accessory {
      flex: none;
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 24px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: var(--radius-pill);
      background: var(--accent-ring, var(--idle-fg));
    }
    .tile-foot {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: left;
      appearance: none;
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      color: inherit;
      border-radius: 8px;
      min-width: 0;
    }
    button.tile-foot {
      cursor: pointer;
    }
    button.tile-foot:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .card.tile .name {
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    /* ---- Read-only value tile: label · big value · right-hand icon circle ---- */
    .card.value {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .val-main {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
      flex: 1;
      text-align: left;
      appearance: none;
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      color: inherit;
      border-radius: 8px;
    }
    button.val-main {
      cursor: pointer;
    }
    button.val-main:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .val-label {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .val-value {
      font: var(--text-value);
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 4px;
      min-width: 0;
      overflow: hidden;
    }
    .val-value > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .val-icon {
      flex: none;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-pill);
      display: grid;
      place-items: center;
      background: var(--icon-bg, var(--idle-bg));
      color: var(--icon-fg, var(--idle-fg));
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-size", this.size);
  }
  updated(ch: Map<string, unknown>) {
    if (ch.has("size")) this.setAttribute("data-size", this.size);
  }

  /** What tapping the card body does. */
  private get _bodyAction(): "detail" | "quick" | null {
    if (this.unavailable) return null;
    if (this.hasDetail) return "detail";
    if (this.quickKind === "activate") return "quick";
    return null;
  }

  private _quick(ev: Event) {
    ev.stopPropagation();
    if (this.unavailable) return;
    if (this.quickKind === "none") {
      if (this.hasDetail) this._emit("hd-activate");
      return;
    }
    this._emit("hd-quick");
  }

  private _body(ev: Event) {
    ev.stopPropagation();
    const action = this._bodyAction;
    if (action === "detail") this._emit("hd-activate");
    else if (action === "quick") this._emit("hd-quick");
  }

  private _emit(type: "hd-quick" | "hd-activate") {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true }));
  }

  private _stop(ev: Event) {
    ev.stopPropagation();
  }

  render() {
    const av = accentVars(this.accent);
    const glyph = this.glyphColor || av.fg;
    const cardVars = `--icon-bg:${av.bg};--icon-fg:${glyph};--accent-ring:${av.fg};--state-color:${
      this.active ? av.fg : "var(--text-secondary)"
    }`;
    const iconInteractive = (this.quickKind !== "none" || this.hasDetail) && !this.unavailable;
    const bodyAction = this._bodyAction;
    const iconLabel =
      this.quickKind !== "none"
        ? this.quickLabel || this.name
        : this.hasDetail
          ? `${this.name} details`
          : this.name;
    const titleLabel = bodyAction === "detail" ? `${this.name} details` : this.name;

    if (this.bleed) {
      return html`<div
        class="card bleed"
        data-clickable=${bodyAction ? "true" : "false"}
        style=${cardVars}
        @click=${this._body}
      >
        <slot></slot>
      </div>`;
    }

    if (this.layout === "tile") return this._renderTile(cardVars, bodyAction, iconInteractive, iconLabel, titleLabel);
    if (this.layout === "value") return this._renderValue(cardVars, bodyAction, titleLabel);
    return this._renderRow(cardVars, bodyAction, iconInteractive, iconLabel, titleLabel);
  }

  /** The reusable quick-action icon button, shared by every layout. */
  private _iconButton(iconInteractive: boolean, iconLabel: string) {
    return html`<button
      class="icon-btn ${this.actionState}"
      data-interactive=${iconInteractive ? "true" : "false"}
      aria-label=${iconLabel}
      ?disabled=${this.unavailable && this.quickKind !== "none"}
      @click=${this._quick}
    >
      <hd-icon .icon=${this.icon} .size=${24}></hd-icon>
    </button>`;
  }

  private _titleBlock(bodyAction: "detail" | "quick" | null, titleLabel: string) {
    const inner = html`<span class="name">${this.name}</span>
      ${this.stateText ? html`<span class="state">${this.stateText}</span>` : nothing}
      ${this.secondary ? html`<span class="secondary">${this.secondary}</span>` : nothing}`;
    return bodyAction
      ? html`<button class="titles" aria-label=${titleLabel} @click=${this._body}>${inner}</button>`
      : html`<div class="titles">${inner}</div>`;
  }

  /** The default header card. */
  private _renderRow(
    cardVars: string,
    bodyAction: "detail" | "quick" | null,
    iconInteractive: boolean,
    iconLabel: string,
    titleLabel: string,
  ) {
    return html`
      <div class="card" data-clickable=${bodyAction ? "true" : "false"} style=${cardVars} @click=${this._body}>
        <div class="header">
          ${this._iconButton(iconInteractive, iconLabel)} ${this._titleBlock(bodyAction, titleLabel)}
          <div class="badge">
            <slot name="badge"></slot>
            ${this.hasDetail && this.quickKind === "none"
              ? html`<hd-icon class="chev" icon="mdi:chevron-right" .size=${20}></hd-icon>`
              : nothing}
          </div>
        </div>
        <div class="body" @click=${this._stop}><slot></slot></div>
      </div>
    `;
  }

  /** Homey device square: icon TL · accessory TR · name pinned to the bottom. */
  private _renderTile(
    cardVars: string,
    bodyAction: "detail" | "quick" | null,
    iconInteractive: boolean,
    iconLabel: string,
    titleLabel: string,
  ) {
    const foot = html`<span class="name">${this.name}</span>
      ${this.stateText ? html`<span class="state">${this.stateText}</span>` : nothing}`;
    return html`
      <div class="card tile" data-clickable=${bodyAction ? "true" : "false"} style=${cardVars} @click=${this._body}>
        <div class="tile-top">
          ${this._iconButton(iconInteractive, iconLabel)}
          <span class="accessory">
            <slot name="badge">${this.active ? html`<span class="dot"></span>` : nothing}</slot>
          </span>
        </div>
        ${bodyAction
          ? html`<button class="tile-foot" aria-label=${titleLabel} @click=${this._body}>${foot}</button>`
          : html`<div class="tile-foot">${foot}</div>`}
      </div>
    `;
  }

  /** Read-only value tile: label · big value · right-hand icon circle. */
  private _renderValue(cardVars: string, bodyAction: "detail" | "quick" | null, titleLabel: string) {
    const main = html`<span class="val-label">${this.name}</span>
      <span class="val-value">
        ${this.stateText ? html`<span>${this.stateText}</span>` : nothing}
        <slot></slot>
      </span>`;
    return html`
      <div class="card value" data-clickable=${bodyAction ? "true" : "false"} style=${cardVars} @click=${this._body}>
        ${bodyAction
          ? html`<button class="val-main" aria-label=${titleLabel} @click=${this._body}>${main}</button>`
          : html`<div class="val-main">${main}</div>`}
        <span class="val-icon"><hd-icon .icon=${this.icon} .size=${22}></hd-icon></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-frame": HdWidgetFrame;
  }
}
