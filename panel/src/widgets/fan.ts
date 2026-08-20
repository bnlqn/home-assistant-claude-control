import { css, html, nothing } from "lit";
import { fanCaps } from "../home-assistant/capabilities.js";
import { buildFanPercentage } from "../home-assistant/service-calls.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import "./widget-frame.js";
import "../primitives/slider.js";

@define("hd-widget-fan")
export class FanWidget extends EntityWidget {
  private _debounce = 0;

  static styles = css`
    .vert {
      flex: 1;
      min-height: 120px;
    }
  `;

  private _setPercentage(percentage: number, final: boolean) {
    window.clearTimeout(this._debounce);
    const send = () => this.entityId && this.callService(
      buildFanPercentage(this.entityId, percentage),
      { errorVerb: "set speed for" },
    );
    if (final) send();
    else this._debounce = window.setTimeout(send, 200);
  }

  renderContent() {
    const vm = this.vm;
    const caps = fanCaps(vm.stateObj);
    const size = this.currentSize;
    const vertical = size === "1x2";
    const showSlider = caps.speed && (size === "2x1" || size === "1x2") && vm.active;
    const percentage = (vm.stateObj?.attributes.percentage as number) ?? 0;
    return html`<hd-widget-frame
      .icon=${vm.icon}
      .layout=${this.layout}
      .name=${vm.name}
      .stateText=${vm.displayState}
      .secondary=${vm.secondary ?? ""}
      .size=${size}
      .accent=${vm.accent}
      .active=${vm.active}
      .unavailable=${!vm.available}
      .hasDetail=${true}
      .quickKind=${"toggle"}
      .quickLabel=${vm.quickAction.label}
      .actionState=${this.actionState}
      @hd-quick=${() => this.runQuick()}
      @hd-activate=${() => this.openDetail()}
    >
      ${showSlider
        ? html`<hd-slider
            class=${vertical ? "vert" : ""}
            .vertical=${vertical}
            .value=${percentage}
            .valueText=${`${Math.round(percentage)}%`}
            icon="mdi:fan"
            label=${`Speed of ${vm.name}`}
            @hd-input=${(event: CustomEvent) => this._setPercentage(event.detail.value, false)}
            @hd-change=${(event: CustomEvent) => this._setPercentage(event.detail.value, true)}
          ></hd-slider>`
        : nothing}
    </hd-widget-frame>`;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearTimeout(this._debounce);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-fan": FanWidget;
  }
}
