import { LitElement, css, html, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import { define } from "./registry.js";
import "./icon-button.js";

/**
 * The single modal surface primitive used by the detail system and dialogs.
 *
 *  variant="auto"   → bottom sheet on narrow panels, right drawer on wide
 *  variant="sheet"  → bottom sheet (drag handle, drag-to-dismiss)
 *  variant="drawer" → right-side drawer (~440px)
 *  variant="center" → centered dialog (confirmations)
 *
 * Responsibilities: backdrop, entry/exit motion, Escape to close, focus trap
 * (focus cannot leave the surface), focus restoration to the opener, and
 * safe-area-aware padding. Content is projected via the default slot; an
 * optional heading renders a shared header with a close control.
 */
@define("hd-surface")
export class HdSurface extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) variant: "auto" | "sheet" | "drawer" | "center" = "auto";
  @property({ type: String }) heading = "";
  @property({ type: String }) subheading = "";
  /** When true, hides the built-in header (caller renders its own). */
  @property({ type: Boolean }) headless = false;

  @state() private _resolved: "sheet" | "drawer" | "center" = "sheet";
  @state() private _dragY = 0;
  @state() private _closing = false;

  @query(".container") private _container?: HTMLElement;

  private _opener: HTMLElement | null = null;
  private _mql?: MediaQueryList;
  private _dragStartY = 0;
  private _dragging = false;

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
    }
    :host([open]) {
      display: block;
    }
    .backdrop {
      position: absolute;
      inset: 0;
      background: rgba(8, 10, 14, 0.44);
      opacity: 0;
      animation: fade var(--motion-surface) var(--ease-standard) forwards;
    }
    :host(.closing) .backdrop {
      animation: fadeOut var(--motion-surface) var(--ease-exit) forwards;
    }
    @keyframes fade {
      to {
        opacity: 1;
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }

    .container {
      position: absolute;
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-raised);
      display: flex;
      flex-direction: column;
      max-height: 100%;
      overscroll-behavior: contain;
    }

    /* Bottom sheet */
    :host(.sheet) .container {
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 92dvh;
      border-radius: var(--radius-sheet) var(--radius-sheet) 0 0;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      animation: sheetIn var(--motion-surface) var(--ease-emphasis) forwards;
    }
    :host(.sheet.closing) .container {
      animation: sheetOut var(--motion-surface) var(--ease-exit) forwards;
    }
    @keyframes sheetIn {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
    @keyframes sheetOut {
      to {
        transform: translateY(100%);
      }
    }

    /* Right drawer */
    :host(.drawer) .container {
      top: 0;
      bottom: 0;
      right: 0;
      width: min(460px, 92vw);
      border-radius: var(--radius-sheet) 0 0 var(--radius-sheet);
      animation: drawerIn var(--motion-surface) var(--ease-emphasis) forwards;
    }
    :host(.drawer.closing) .container {
      animation: drawerOut var(--motion-surface) var(--ease-exit) forwards;
    }
    @keyframes drawerIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
    @keyframes drawerOut {
      to {
        transform: translateX(100%);
      }
    }

    /* Centered dialog */
    :host(.center) .container {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(400px, 92vw);
      border-radius: var(--radius-widget);
      animation: dialogIn var(--motion-surface) var(--ease-emphasis) forwards;
    }
    :host(.center.closing) .container {
      animation: dialogOut var(--motion-content) var(--ease-exit) forwards;
    }
    @keyframes dialogIn {
      from {
        opacity: 0;
        transform: translate(-50%, -46%) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    @keyframes dialogOut {
      to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.97);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .backdrop,
      .container {
        animation-duration: 1ms !important;
      }
    }

    .handle {
      align-self: center;
      width: 40px;
      height: 5px;
      border-radius: var(--radius-pill);
      background: var(--border-strong);
      margin: 10px 0 4px;
      flex: none;
      touch-action: none;
      cursor: grab;
    }
    :host(:not(.sheet)) .handle {
      display: none;
    }

    header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 10px 16px 12px 22px;
      flex: none;
    }
    .titles {
      flex: 1;
      min-width: 0;
      padding-top: 4px;
    }
    .titles h2 {
      margin: 0;
      font: var(--text-drawer-title);
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
    .body {
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding: 4px 22px 24px;
    }
    .sentinel {
      position: fixed;
      width: 1px;
      height: 1px;
      opacity: 0;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._mql = window.matchMedia("(min-width: 840px)");
    this._resolveVariant();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._onKeyDown, true);
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open) this._activate();
      else this._deactivate();
    }
    if (changed.has("variant")) this._resolveVariant();
  }

  private _resolveVariant() {
    if (this.variant === "auto") {
      this._resolved = this._mql?.matches ? "drawer" : "sheet";
    } else {
      this._resolved = this.variant;
    }
    this.classList.toggle("sheet", this._resolved === "sheet");
    this.classList.toggle("drawer", this._resolved === "drawer");
    this.classList.toggle("center", this._resolved === "center");
  }

  private _activate() {
    this._resolveVariant();
    this._closing = false;
    this.classList.remove("closing");
    this._opener = (this.getRootNode() as Document | ShadowRoot).activeElement as HTMLElement | null;
    document.addEventListener("keydown", this._onKeyDown, true);
    // Focus the first control after the entry transition begins.
    requestAnimationFrame(() => this._focusFirst());
  }

  private _deactivate() {
    document.removeEventListener("keydown", this._onKeyDown, true);
    // Restore focus to the widget that opened us.
    if (this._opener && typeof this._opener.focus === "function") {
      this._opener.focus();
    }
    this._opener = null;
  }

  private _onKeyDown = (ev: KeyboardEvent) => {
    if (!this.open) return;
    if (ev.key === "Escape") {
      ev.stopPropagation();
      this.requestClose();
    }
  };

  private _focusFirst() {
    const focusables = this._focusable();
    (focusables[0] ?? this._container)?.focus();
  }

  private _focusable(): HTMLElement[] {
    const sel =
      'button, [href], input, select, textarea, hd-icon-button, hd-toggle, hd-slider, hd-segmented, [tabindex]:not([tabindex="-1"])';
    const inShadow = Array.from(this.renderRoot.querySelectorAll<HTMLElement>(sel));
    const slotted = Array.from(this.querySelectorAll<HTMLElement>(sel));
    return [...inShadow, ...slotted].filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null && !el.classList.contains("sentinel"),
    );
  }

  /** Sentinel focus handlers keep focus trapped inside the surface. */
  private _wrap(which: "first" | "last") {
    const f = this._focusable();
    const target = which === "first" ? f[0] : f[f.length - 1];
    (target ?? this._container)?.focus();
  }

  requestClose() {
    if (this._closing) return;
    this._closing = true;
    this.classList.add("closing");
    const done = () => {
      this.classList.remove("closing");
      this._closing = false;
      this.dispatchEvent(new CustomEvent("hd-close", { bubbles: true, composed: true }));
    };
    // Wait for the exit animation, then notify the owner to unset `open`.
    const container = this._container;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.setTimeout(done, 10);
      return;
    }
    let called = false;
    const once = () => {
      if (called) return;
      called = true;
      done();
    };
    container.addEventListener("animationend", once, { once: true });
    window.setTimeout(once, 400);
  }

  // ---- Drag-to-dismiss (sheet only) ----
  private _onHandleDown = (ev: PointerEvent) => {
    if (this._resolved !== "sheet") return;
    this._dragging = true;
    this._dragStartY = ev.clientY;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
  };
  private _onHandleMove = (ev: PointerEvent) => {
    if (!this._dragging) return;
    this._dragY = Math.max(0, ev.clientY - this._dragStartY);
    if (this._container) this._container.style.transform = `translateY(${this._dragY}px)`;
  };
  private _onHandleUp = () => {
    if (!this._dragging) return;
    this._dragging = false;
    if (this._container) this._container.style.transform = "";
    if (this._dragY > 120) this.requestClose();
    this._dragY = 0;
  };

  private _onBackdrop(ev: Event) {
    if (ev.target === ev.currentTarget) this.requestClose();
  }

  render() {
    if (!this.open) return nothing;
    const labelled = this.heading ? "hd-surface-title" : undefined;
    return html`
      <div class="backdrop" @click=${(e: Event) => this._onBackdrop(e)}></div>
      <div class="sentinel" tabindex="0" @focus=${() => this._wrap("last")}></div>
      <div
        class="container"
        role="dialog"
        aria-modal="true"
        aria-label=${this.heading ? nothing : "Details"}
        aria-labelledby=${labelled ?? nothing}
        tabindex="-1"
      >
        <div
          class="handle"
          @pointerdown=${this._onHandleDown}
          @pointermove=${this._onHandleMove}
          @pointerup=${this._onHandleUp}
          @pointercancel=${this._onHandleUp}
        ></div>
        ${this.headless
          ? nothing
          : html`
              <header>
                <div class="titles">
                  <h2 id="hd-surface-title">${this.heading}</h2>
                  ${this.subheading ? html`<p>${this.subheading}</p>` : nothing}
                </div>
                <hd-icon-button
                  icon="mdi:close"
                  label="Close"
                  variant="soft"
                  @click=${() => this.requestClose()}
                ></hd-icon-button>
              </header>
            `}
        <div class="body"><slot></slot></div>
      </div>
      <div class="sentinel" tabindex="0" @focus=${() => this._wrap("first")}></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-surface": HdSurface;
  }
}
