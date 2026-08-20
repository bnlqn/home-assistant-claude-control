import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "./registry.js";
import "./entity-icon.js";

/**
 * A large, touch-friendly fill slider (the Homey-style brightness/volume bar).
 * Horizontal or vertical. Fully keyboard operable with proper slider semantics.
 *
 * Events:
 *   `hd-input`  — continuous while dragging (consumer debounces service calls)
 *   `hd-change` — final, precise value on release / keypress
 */
@define("hd-slider")
export class HdSlider extends LitElement {
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean, reflect: true }) vertical = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = "";
  @property({ type: String }) icon = "";
  /** Optional value text shown on the fill (e.g. "63%"). */
  @property({ type: String }) valueText = "";
  /** Accent color of the fill (defaults to the brand accent). */
  @property({ type: String }) color = "var(--accent)";

  @state() private _dragging = false;
  @state() private _dragValue = 0;
  private _raf = 0;

  static styles = css`
    :host {
      display: block;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
    }
    .track {
      position: relative;
      width: 100%;
      height: 46px;
      border-radius: var(--radius-control);
      background: var(--surface-sunken);
      box-shadow: var(--shadow-inset-control);
      overflow: hidden;
      cursor: pointer;
      outline: none;
    }
    :host([vertical]) .track {
      width: 58px;
      height: 100%;
      min-height: 120px;
    }
    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--fill, 0%);
      background: var(--fill-color, var(--accent));
      transition: width var(--motion-state) var(--ease-standard),
        height var(--motion-state) var(--ease-standard);
    }
    :host([vertical]) .fill {
      inset: auto 0 0 0;
      width: auto;
      height: var(--fill, 0%);
    }
    :host([dragging]) .fill {
      transition: none;
    }
    .content {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 14px;
      pointer-events: none;
      color: var(--text-primary);
      font: var(--text-secondary-state);
      mix-blend-mode: normal;
    }
    :host([vertical]) .content {
      flex-direction: column-reverse;
      justify-content: flex-start;
      padding: 12px 0;
      text-align: center;
    }
    .val {
      font-variant-numeric: tabular-nums;
      font-weight: 650;
    }
    .track:focus-visible {
      box-shadow: var(--focus-ring), var(--shadow-inset-control);
    }
    :host([disabled]) {
      opacity: 0.45;
      pointer-events: none;
    }
  `;

  private get _current(): number {
    return this._dragging ? this._dragValue : this.value;
  }

  private _ratio(): number {
    const span = this.max - this.min || 1;
    return Math.min(1, Math.max(0, (this._current - this.min) / span));
  }

  private _snap(v: number): number {
    const span = this.max - this.min;
    let snapped = Math.round((v - this.min) / this.step) * this.step + this.min;
    snapped = Math.min(this.max, Math.max(this.min, snapped));
    // Guard against FP drift for integer-ish steps.
    return Math.abs(span) > 0 ? Number(snapped.toFixed(4)) : snapped;
  }

  private _valueFromPointer(ev: PointerEvent): number {
    const track = this.renderRoot.querySelector(".track") as HTMLElement;
    const rect = track.getBoundingClientRect();
    let ratio: number;
    if (this.vertical) {
      ratio = 1 - (ev.clientY - rect.top) / rect.height;
    } else {
      ratio = (ev.clientX - rect.left) / rect.width;
    }
    ratio = Math.min(1, Math.max(0, ratio));
    return this._snap(this.min + ratio * (this.max - this.min));
  }

  private _onPointerDown(ev: PointerEvent) {
    if (this.disabled) return;
    ev.preventDefault();
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    this._dragging = true;
    this._dragValue = this._valueFromPointer(ev);
    this._emit("hd-input");
  }

  private _onPointerMove(ev: PointerEvent) {
    if (!this._dragging) return;
    const v = this._valueFromPointer(ev);
    if (v === this._dragValue) return;
    this._dragValue = v;
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this._emit("hd-input");
    });
  }

  private _onPointerUp(ev: PointerEvent) {
    if (!this._dragging) return;
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
    }
    const finalV = this._valueFromPointer(ev);
    this._dragValue = finalV;
    this.value = finalV;
    this._dragging = false;
    this._emit("hd-change");
  }

  private _onKeyDown(ev: KeyboardEvent) {
    if (this.disabled) return;
    const big = Math.max(this.step, (this.max - this.min) / 10);
    let next: number;
    switch (ev.key) {
      case "ArrowUp":
      case "ArrowRight":
        next = this.value + this.step;
        break;
      case "ArrowDown":
      case "ArrowLeft":
        next = this.value - this.step;
        break;
      case "PageUp":
        next = this.value + big;
        break;
      case "PageDown":
        next = this.value - big;
        break;
      case "Home":
        next = this.min;
        break;
      case "End":
        next = this.max;
        break;
      default:
        return;
    }
    ev.preventDefault();
    next = this._snap(next);
    if (next !== this.value) {
      this.value = next;
      this._emit("hd-input");
      this._emit("hd-change");
    }
  }

  private _emit(type: "hd-input" | "hd-change") {
    this.dispatchEvent(
      new CustomEvent(type, { detail: { value: this._current }, bubbles: true, composed: true }),
    );
  }

  render() {
    const pct = `${this._ratio() * 100}%`;
    return html`
      <div
        class="track"
        role="slider"
        tabindex=${this.disabled ? -1 : 0}
        aria-label=${this.label}
        aria-orientation=${this.vertical ? "vertical" : "horizontal"}
        aria-valuemin=${this.min}
        aria-valuemax=${this.max}
        aria-valuenow=${Math.round(this._current)}
        aria-valuetext=${this.valueText || String(Math.round(this._current))}
        aria-disabled=${this.disabled ? "true" : "false"}
        style=${`--fill:${pct};--fill-color:${this.color}`}
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerUp}
        @keydown=${this._onKeyDown}
      >
        <div class="fill"></div>
        <div class="content">
          ${this.icon ? html`<hd-icon .icon=${this.icon} .size=${20}></hd-icon>` : nothing}
          ${this.valueText ? html`<span class="val">${this.valueText}</span>` : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-slider": HdSlider;
  }
}
