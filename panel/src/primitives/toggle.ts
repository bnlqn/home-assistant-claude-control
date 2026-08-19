import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";

/**
 * Accessible on/off switch. role="switch", keyboard operable, 44px hit area.
 * Emits `hd-toggle` with `{ checked }`.
 */
@define("hd-toggle")
export class HdToggle extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = "";

  static styles = css`
    :host {
      display: inline-flex;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      position: relative;
      width: 52px;
      height: 32px;
      min-height: 44px;
      padding: 6px 0;
      background: transparent;
      display: inline-flex;
      align-items: center;
    }
    .track {
      width: 52px;
      height: 32px;
      border-radius: var(--radius-pill);
      background: var(--surface-sunken);
      box-shadow: var(--shadow-inset-control);
      transition: background var(--motion-state) var(--ease-standard);
      position: relative;
    }
    .thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
      transition: transform var(--motion-state) var(--ease-emphasis);
    }
    :host([checked]) .track {
      background: var(--accent);
    }
    :host([checked]) .thumb {
      transform: translateX(20px);
    }
    button:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
    button:focus-visible {
      outline: none;
    }
    button:focus-visible .track {
      box-shadow: var(--focus-ring), var(--shadow-inset-control);
    }
  `;

  private _toggle() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent("hd-toggle", { detail: { checked: this.checked }, bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <button
        role="switch"
        aria-checked=${this.checked ? "true" : "false"}
        aria-label=${this.label}
        ?disabled=${this.disabled}
        @click=${this._toggle}
      >
        <span class="track"><span class="thumb"></span></span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-toggle": HdToggle;
  }
}
