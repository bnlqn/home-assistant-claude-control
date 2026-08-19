import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { coverCaps } from "../home-assistant/capabilities.js";
import {
  buildCoverClose,
  buildCoverOpen,
  buildCoverPosition,
  buildCoverStop,
} from "../home-assistant/service-calls.js";
import "./widget-frame.js";
import "../primitives/icon-button.js";
import "../primitives/slider.js";

/**
 * Cover / blind / door widget. Open · Stop · Close buttons for the actions the
 * cover advertises, plus a position slider when it supports set_position.
 */
@define("hd-widget-cover")
export class CoverWidget extends EntityWidget {
  @state() private _optimistic: number | null = null;
  private _optimisticTs = 0;
  private _debounce = 0;

  static styles = css`
    .controls {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
    }
    .controls.center {
      justify-content: space-evenly;
    }
    .vert {
      flex: 1;
      min-height: 120px;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: 100%;
    }
  `;

  private get _position(): number {
    const vm = this.vm;
    const live = (vm.stateObj?.attributes.current_position as number) ?? (vm.rawState === "open" ? 100 : 0);
    if (this._optimistic != null) {
      if (Math.abs(live - this._optimistic) <= 2 || Date.now() - this._optimisticTs > 1600) {
        this._optimistic = null;
        return live;
      }
      return this._optimistic;
    }
    return live;
  }

  private _setPosition(pct: number, final: boolean) {
    this._optimistic = pct;
    this._optimisticTs = Date.now();
    window.clearTimeout(this._debounce);
    const send = () => {
      if (this.entityId) void this.callService(buildCoverPosition(this.entityId, pct), { errorVerb: "move" });
    };
    if (final) send();
    else this._debounce = window.setTimeout(send, 200);
  }

  private _buttons(caps: ReturnType<typeof coverCaps>, center: boolean) {
    const vm = this.vm;
    const dis = !vm.available;
    return html`<div class="controls ${center ? "center" : ""}">
      ${caps.open
        ? html`<hd-icon-button
            icon="mdi:arrow-up"
            label="Open"
            variant="soft"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildCoverOpen(this.entityId), { errorVerb: "open" })}
          ></hd-icon-button>`
        : nothing}
      ${caps.stop
        ? html`<hd-icon-button
            icon="mdi:stop"
            label="Stop"
            variant="soft"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildCoverStop(this.entityId), { errorVerb: "stop" })}
          ></hd-icon-button>`
        : nothing}
      ${caps.close
        ? html`<hd-icon-button
            icon="mdi:arrow-down"
            label="Close"
            variant="soft"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildCoverClose(this.entityId), { errorVerb: "close" })}
          ></hd-icon-button>`
        : nothing}
    </div>`;
  }

  renderContent() {
    const vm = this.vm;
    const caps = coverCaps(vm.stateObj);
    const size = this.currentSize;
    const vertical = size === "1x2";
    const showSlider = caps.setPosition && size !== "1x1";

    let body;
    if (vertical && showSlider) {
      body = html`<div class="stack">
        <hd-slider
          class="vert"
          vertical
          .value=${this._position}
          .disabled=${!vm.available}
          .valueText=${`${Math.round(this._position)}%`}
          icon="mdi:window-shutter"
          label=${`Position of ${vm.name}`}
          @hd-input=${(e: CustomEvent) => this._setPosition(e.detail.value, false)}
          @hd-change=${(e: CustomEvent) => this._setPosition(e.detail.value, true)}
        ></hd-slider>
        ${this._buttons(caps, true)}
      </div>`;
    } else if (showSlider) {
      body = html`<div class="stack">
        <hd-slider
          .value=${this._position}
          .disabled=${!vm.available}
          .valueText=${`${Math.round(this._position)}% open`}
          label=${`Position of ${vm.name}`}
          @hd-input=${(e: CustomEvent) => this._setPosition(e.detail.value, false)}
          @hd-change=${(e: CustomEvent) => this._setPosition(e.detail.value, true)}
        ></hd-slider>
        ${this._buttons(caps, false)}
      </div>`;
    } else {
      body = this._buttons(caps, size !== "1x1");
    }

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .name=${vm.name}
        .stateText=${vm.displayState}
        .size=${size}
        .accent=${vm.accent}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${body}
      </hd-widget-frame>
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._debounce);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-cover": CoverWidget;
  }
}
