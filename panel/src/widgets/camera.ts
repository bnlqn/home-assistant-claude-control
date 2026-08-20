import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import "./widget-frame.js";

@define("hd-widget-camera")
export class CameraWidget extends EntityWidget {
  @state() private _cacheBust = Date.now();
  private _timer = 0;

  static styles = css`
    .tile {
      position: relative;
      height: 100%;
      min-height: 120px;
      background: #0b0d10;
      display: grid;
      place-items: center;
      overflow: hidden;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .label {
      position: absolute;
      left: 12px;
      bottom: 10px;
      color: #fff;
      font: var(--text-secondary-state);
      font-weight: 650;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    }
    .off {
      color: var(--text-tertiary);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    // Refresh the still every 10s only while mounted & visible.
    this._timer = window.setInterval(() => (this._cacheBust = Date.now()), 10000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }

  renderContent() {
    const vm = this.vm;
    const pic = vm.stateObj?.attributes.entity_picture as string | undefined;
    const src = pic ? `${pic}${pic.includes("?") ? "&" : "?"}_=${this._cacheBust}` : undefined;
    return html`<hd-widget-frame
      bleed
      .name=${vm.name}
      .size=${this.currentSize}
      .accent=${"accent"}
      .hasDetail=${true}
      .quickKind=${"none"}
      @hd-activate=${() => this.openDetail()}
    >
      <div class="tile">
        ${src && vm.available
          ? html`<img src=${src} alt=${`Live view of ${vm.name}`} loading="lazy" />`
          : html`<div class="off"><hd-icon icon="mdi:cctv" .size=${34}></hd-icon><span>${vm.displayState}</span></div>`}
        <span class="label">${vm.name}</span>
      </div>
    </hd-widget-frame>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-camera": CameraWidget;
  }
}
