import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";
import "./entity-icon.js";

/**
 * A circular, 44×44 minimum touch target icon button with pressed/focus/loading
 * states. Emits a standard `click`. Used for transport, stepper, close, etc.
 */
@define("hd-icon-button")
export class HdIconButton extends LitElement {
  @property({ type: String }) icon = "";
  @property({ type: String }) label = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  /** filled = accent background · plain = transparent. */
  @property({ type: String }) variant: "plain" | "filled" | "soft" = "plain";
  @property({ type: Number }) size = 22;

  static styles = css`
    :host {
      display: inline-flex;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      width: 44px;
      height: 44px;
      padding: 0;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--text-primary);
      transition: background var(--motion-press) var(--ease-standard),
        transform var(--motion-press) var(--ease-standard);
    }
    button:hover:not(:disabled) {
      background: var(--surface-hover);
    }
    button:active:not(:disabled) {
      transform: scale(0.92);
    }
    :host([variant="filled"]) button {
      background: var(--accent);
      color: var(--text-on-accent);
    }
    :host([variant="filled"]) button:hover:not(:disabled) {
      background: var(--accent-hover);
    }
    :host([variant="soft"]) button {
      background: var(--surface-subtle);
    }
    :host([variant="soft"]) button:hover:not(:disabled) {
      background: var(--surface-hover);
    }
    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .spin {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-top-color: transparent;
      opacity: 0.8;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spin {
        animation-duration: 1.6s;
      }
      button:active:not(:disabled) {
        transform: none;
      }
    }
  `;

  render() {
    return html`
      <button
        ?disabled=${this.disabled || this.loading}
        aria-label=${this.label || this.icon}
        aria-busy=${this.loading ? "true" : "false"}
      >
        ${this.loading
          ? html`<span class="spin" role="progressbar"></span>`
          : html`<hd-icon .icon=${this.icon} .size=${this.size}></hd-icon>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-icon-button": HdIconButton;
  }
}
