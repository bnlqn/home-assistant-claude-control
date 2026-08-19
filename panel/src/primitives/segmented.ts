import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";
import "./entity-icon.js";

export interface SegmentOption {
  value: string;
  label?: string;
  icon?: string;
}

/**
 * A rounded segmented control (HVAC mode, fan speed, source). Radio semantics,
 * arrow-key navigation. Emits `hd-select` with `{ value }`.
 */
@define("hd-segmented")
export class HdSegmented extends LitElement {
  @property({ attribute: false }) options: SegmentOption[] = [];
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = "";

  static styles = css`
    :host {
      display: block;
    }
    .group {
      display: flex;
      gap: 4px;
      padding: 4px;
      background: var(--surface-sunken);
      border-radius: var(--radius-pill);
      flex-wrap: wrap;
    }
    button {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      cursor: pointer;
      flex: 1 1 auto;
      min-height: 40px;
      padding: 0 14px;
      border-radius: var(--radius-pill);
      background: transparent;
      color: var(--text-secondary);
      font: var(--text-secondary-state);
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      white-space: nowrap;
      transition: background var(--motion-state) var(--ease-standard),
        color var(--motion-state) var(--ease-standard);
    }
    button[aria-checked="true"] {
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-widget);
    }
    button:hover:not([aria-checked="true"]) {
      color: var(--text-primary);
    }
    button:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
  `;

  private _select(value: string) {
    if (this.disabled || value === this.value) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent("hd-select", { detail: { value }, bubbles: true, composed: true }));
  }

  private _onKey(ev: KeyboardEvent, idx: number) {
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    ev.preventDefault();
    const dir = ev.key === "ArrowRight" ? 1 : -1;
    const next = (idx + dir + this.options.length) % this.options.length;
    const opt = this.options[next];
    this._select(opt.value);
    const btns = this.renderRoot.querySelectorAll("button");
    (btns[next] as HTMLElement)?.focus();
  }

  render() {
    return html`
      <div class="group" role="radiogroup" aria-label=${this.label}>
        ${this.options.map(
          (o, i) => html`
            <button
              role="radio"
              aria-checked=${o.value === this.value ? "true" : "false"}
              tabindex=${o.value === this.value ? 0 : -1}
              @click=${() => this._select(o.value)}
              @keydown=${(e: KeyboardEvent) => this._onKey(e, i)}
            >
              ${o.icon ? html`<hd-icon .icon=${o.icon} .size=${18}></hd-icon>` : nothing}
              ${o.label ? html`<span>${o.label}</span>` : nothing}
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-segmented": HdSegmented;
  }
}
