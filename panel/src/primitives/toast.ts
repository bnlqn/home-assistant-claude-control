import { LitElement, css, html } from "lit";
import { state } from "lit/decorators.js";
import { define } from "./registry.js";
import type { ToastOptions } from "./feedback.js";
import "./entity-icon.js";

interface ActiveToast extends ToastOptions {
  id: number;
}

/**
 * Transient feedback stack (bottom-center). Announced politely to screen
 * readers via an aria-live region. Rendered once by the app shell.
 */
@define("hd-toasts")
export class HdToasts extends LitElement {
  @state() private _toasts: ActiveToast[] = [];
  private _seq = 0;

  static styles = css`
    :host {
      position: fixed;
      left: 50%;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 18px);
      transform: translateX(-50%);
      z-index: 1100;
      display: flex;
      flex-direction: column-reverse;
      gap: 8px;
      pointer-events: none;
      width: max-content;
      max-width: min(92vw, 420px);
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: var(--radius-pill);
      background: var(--surface-inverse);
      color: var(--canvas);
      box-shadow: var(--shadow-raised);
      font: var(--text-secondary-state);
      font-weight: 600;
      animation: rise var(--motion-surface) var(--ease-emphasis) both;
    }
    .toast.eco {
      background: var(--state-eco);
      color: #06210f;
    }
    .toast.warn {
      background: var(--state-warn);
      color: #2a1c00;
    }
    .toast.alert {
      background: var(--state-alert);
      color: #2a0606;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation-duration: 1ms;
      }
    }
  `;

  show(opts: ToastOptions) {
    const id = ++this._seq;
    this._toasts = [...this._toasts, { ...opts, id }];
    const duration = opts.duration ?? 3200;
    window.setTimeout(() => {
      this._toasts = this._toasts.filter((t) => t.id !== id);
    }, duration);
  }

  render() {
    return html`<div aria-live="polite" aria-atomic="false">
      ${this._toasts.map(
        (t) => html`<div class="toast ${t.tone ?? "neutral"}" role="status">
          ${t.icon ? html`<hd-icon .icon=${t.icon} .size=${18}></hd-icon>` : ""}
          <span>${t.message}</span>
        </div>`,
      )}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-toasts": HdToasts;
  }
}
