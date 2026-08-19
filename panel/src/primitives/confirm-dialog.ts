import { LitElement, css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "./registry.js";
import type { ConfirmOptions } from "./feedback.js";
import "./surface.js";
import "./entity-icon.js";

/**
 * Confirmation dialog for sensitive actions (unlock, disarm, destructive
 * scripts, anything `requiresConfirmation`). Imperative `ask()` returns a
 * Promise<boolean>. Rendered once by the app shell.
 */
@define("hd-confirm")
export class HdConfirm extends LitElement {
  @state() private _open = false;
  @state() private _opts: ConfirmOptions | null = null;
  private _resolve: ((v: boolean) => void) | null = null;

  static styles = css`
    .content {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding-top: 4px;
    }
    .head {
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .badge {
      flex: none;
      width: 46px;
      height: 46px;
      border-radius: var(--radius-icon);
      display: grid;
      place-items: center;
      background: var(--accent-soft);
      color: var(--accent-text);
    }
    .badge.destructive {
      background: var(--state-alert-soft);
      color: var(--state-alert);
    }
    h3 {
      margin: 0 0 4px;
      font: var(--text-drawer-title);
    }
    p {
      margin: 0;
      color: var(--text-secondary);
      font: var(--text-secondary-state);
      line-height: 1.45;
    }
    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      min-height: 44px;
      padding: 0 18px;
      border-radius: var(--radius-control);
      font: var(--text-widget-title);
      font-weight: 650;
      transition: background var(--motion-press) var(--ease-standard);
    }
    .cancel {
      background: var(--surface-subtle);
      color: var(--text-primary);
    }
    .cancel:hover {
      background: var(--surface-hover);
    }
    .ok {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    .ok:hover {
      background: var(--accent-hover);
    }
    .ok.destructive {
      background: var(--state-alert);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
  `;

  ask(opts: ConfirmOptions): Promise<boolean> {
    this._opts = opts;
    this._open = true;
    return new Promise<boolean>((resolve) => {
      this._resolve = resolve;
    });
  }

  private _settle(result: boolean) {
    this._resolve?.(result);
    this._resolve = null;
    this._open = false;
  }

  render() {
    const o = this._opts;
    if (!o) return nothing;
    return html`
      <hd-surface
        variant="center"
        headless
        ?open=${this._open}
        @hd-close=${() => this._settle(false)}
      >
        <div class="content">
          <div class="head">
            <div class="badge ${o.destructive ? "destructive" : ""}">
              <hd-icon .icon=${o.icon ?? (o.destructive ? "mdi:alert" : "mdi:help-circle-outline")} .size=${24}></hd-icon>
            </div>
            <div>
              <h3>${o.title}</h3>
              ${o.message ? html`<p>${o.message}</p>` : nothing}
            </div>
          </div>
          <div class="actions">
            <button class="cancel" @click=${() => this._settle(false)}>${o.cancelLabel ?? "Cancel"}</button>
            <button class="ok ${o.destructive ? "destructive" : ""}" @click=${() => this._settle(true)}>
              ${o.confirmLabel ?? "Confirm"}
            </button>
          </div>
        </div>
      </hd-surface>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-confirm": HdConfirm;
  }
}
