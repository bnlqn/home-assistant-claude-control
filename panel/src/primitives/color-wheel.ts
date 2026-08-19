import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";

/**
 * HS colour wheel: hue is the angle, saturation the radius. Drag the handle to
 * pick; emits `hd-color-input` continuously and `hd-color` on release (so
 * callers can throttle service calls to the final value).
 *
 * Its custom element is defined on demand: the detail surface dynamic-imports
 * this module the first time a colour-capable light opens, so its setup cost
 * isn't paid up front. (The single-file build currently inlines the dynamic
 * import; it becomes a real lazy chunk once code-splitting is enabled.)
 *
 * The handle angle is aligned to the conic gradient: hue 0 (red) is due east,
 * increasing clockwise, matching `atan2(dy, dx)`.
 */
@define("hd-color-wheel")
export class HdColorWheel extends LitElement {
  @property({ type: Number }) hue = 0; // 0..360
  @property({ type: Number }) sat = 100; // 0..100
  @property({ type: Boolean, reflect: true }) disabled = false;

  static styles = css`
    :host {
      display: block;
    }
    .wheel {
      position: relative;
      width: 100%;
      max-width: 240px;
      aspect-ratio: 1;
      margin: 0 auto;
      border-radius: 50%;
      touch-action: none;
      cursor: crosshair;
      background:
        radial-gradient(circle at center, #fff 0%, rgba(255, 255, 255, 0) 100%),
        conic-gradient(
          from 90deg,
          hsl(0, 100%, 50%),
          hsl(60, 100%, 50%),
          hsl(120, 100%, 50%),
          hsl(180, 100%, 50%),
          hsl(240, 100%, 50%),
          hsl(300, 100%, 50%),
          hsl(360, 100%, 50%)
        );
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }
    :host([disabled]) .wheel {
      opacity: 0.4;
      pointer-events: none;
    }
    .handle {
      position: absolute;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 1px 5px rgba(0, 0, 0, 0.45);
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
  `;

  private _track(ev: PointerEvent) {
    const el = this.renderRoot.querySelector(".wheel") as HTMLElement | null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = ev.clientX - (rect.left + rect.width / 2);
    const dy = ev.clientY - (rect.top + rect.height / 2);
    const r = Math.min(1, Math.hypot(dx, dy) / (rect.width / 2));
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (deg < 0) deg += 360;
    this.hue = Math.round(deg);
    this.sat = Math.round(r * 100);
    this._emit("hd-color-input");
  }

  private _onDown = (ev: PointerEvent) => {
    if (this.disabled) return;
    ev.preventDefault();
    this._track(ev);
    const move = (e: PointerEvent) => this._track(e);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      this._emit("hd-color");
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  private _emit(type: "hd-color" | "hd-color-input") {
    this.dispatchEvent(
      new CustomEvent(type, { detail: { hue: this.hue, sat: this.sat }, bubbles: true, composed: true }),
    );
  }

  render() {
    const rad = (this.hue * Math.PI) / 180;
    const r = this.sat / 100;
    const x = 50 + Math.cos(rad) * r * 50;
    const y = 50 + Math.sin(rad) * r * 50;
    const color = `hsl(${this.hue}, ${this.sat}%, 50%)`;
    return html`<div
      class="wheel"
      role="slider"
      aria-label="Colour"
      aria-valuetext=${`hue ${this.hue}°, saturation ${this.sat}%`}
      @pointerdown=${this._onDown}
    >
      <div class="handle" style=${`left:${x}%;top:${y}%;background:${color}`}></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-color-wheel": HdColorWheel;
  }
}
