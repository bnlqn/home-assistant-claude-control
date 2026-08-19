import { LitElement, css, html, svg, nothing } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";
import { MDI_PATHS } from "../design-system/mdi-paths.js";

/**
 * Renders an `mdi:*` glyph as inline SVG from the bundled path map. If a name
 * isn't in the curated set (e.g. a user-supplied icon in the config), it falls
 * back to Home Assistant's `<ha-icon>` when present, else a neutral dot — so an
 * unknown icon never breaks a widget.
 */
@define("hd-icon")
export class HdIcon extends LitElement {
  @property({ type: String }) icon = "";
  /** px size of the glyph. */
  @property({ type: Number }) size = 24;

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      line-height: 0;
    }
    svg {
      display: block;
      width: var(--hd-icon-size, 24px);
      height: var(--hd-icon-size, 24px);
      fill: currentColor;
    }
    .dot {
      width: calc(var(--hd-icon-size, 24px) * 0.4);
      height: calc(var(--hd-icon-size, 24px) * 0.4);
      border-radius: 50%;
      background: currentColor;
      opacity: 0.5;
    }
  `;

  render() {
    const path = MDI_PATHS[this.icon];
    const sizeStyle = `--hd-icon-size:${this.size}px`;
    if (path) {
      return html`<svg viewBox="0 0 24 24" style=${sizeStyle} aria-hidden="true">
        ${svg`<path d=${path}></path>`}
      </svg>`;
    }
    // Fall back to ha-icon if the running frontend provides it.
    if (typeof customElements !== "undefined" && customElements.get("ha-icon") && this.icon) {
      const el = document.createElement("ha-icon");
      el.setAttribute("icon", this.icon);
      el.style.setProperty("--mdc-icon-size", `${this.size}px`);
      el.style.width = `${this.size}px`;
      el.style.height = `${this.size}px`;
      return html`${el}`;
    }
    return this.icon ? html`<span class="dot" style=${sizeStyle}></span>` : nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-icon": HdIcon;
  }
}
