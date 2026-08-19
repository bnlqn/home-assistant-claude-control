import { css, html, nothing } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { vacuumCaps } from "../home-assistant/capabilities.js";
import {
  buildVacuumFanSpeed,
  buildVacuumPause,
  buildVacuumReturn,
  buildVacuumStart,
} from "../home-assistant/service-calls.js";
import { titleCase } from "../home-assistant/state-formatting.js";
import type { SegmentOption } from "../primitives/segmented.js";
import "./widget-frame.js";
import "../primitives/icon-button.js";
import "../primitives/segmented.js";

/** Robot vacuum widget: start / pause / dock, with fan-speed selection at 2×2. */
@define("hd-widget-vacuum")
export class VacuumWidget extends EntityWidget {
  static styles = css`
    .controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .fan {
      margin-top: 4px;
    }
  `;

  private _controls(caps: ReturnType<typeof vacuumCaps>) {
    const vm = this.vm;
    const st = vm.rawState;
    const dis = !vm.available;
    const cleaning = st === "cleaning";
    return html`<div class="controls" @click=${(e: Event) => e.stopPropagation()}>
      ${cleaning && caps.pause
        ? html`<hd-icon-button
            icon="mdi:pause"
            label="Pause"
            variant="soft"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildVacuumPause(this.entityId), { errorVerb: "pause" })}
          ></hd-icon-button>`
        : html`<hd-icon-button
            icon="mdi:play"
            label="Start"
            variant="filled"
            .disabled=${dis || !caps.start}
            @click=${() => this.entityId && this.callService(buildVacuumStart(this.entityId), { errorVerb: "start" })}
          ></hd-icon-button>`}
      ${caps.returnHome
        ? html`<hd-icon-button
            icon="mdi:home-import-outline"
            label="Return to dock"
            variant="soft"
            .disabled=${dis || st === "docked"}
            @click=${() => this.entityId && this.callService(buildVacuumReturn(this.entityId), { errorVerb: "dock" })}
          ></hd-icon-button>`
        : nothing}
    </div>`;
  }

  private _fanSpeed() {
    const vm = this.vm;
    const list = (vm.stateObj?.attributes.fan_speed_list as string[] | undefined) ?? [];
    const speeds = list.filter((s) => !["off", "custom"].includes(s));
    if (speeds.length < 2) return nothing;
    const options: SegmentOption[] = speeds.map((s) => ({ value: s, label: titleCase(s) }));
    return html`<div class="fan">
      <hd-segmented
        .options=${options}
        .value=${(vm.stateObj?.attributes.fan_speed as string) ?? ""}
        .disabled=${!vm.available}
        label="Suction power"
        @hd-select=${(e: CustomEvent) =>
          this.entityId && this.callService(buildVacuumFanSpeed(this.entityId, e.detail.value), { errorVerb: "set suction for" })}
      ></hd-segmented>
    </div>`;
  }

  render() {
    const vm = this.vm;
    const size = this.currentSize;
    const caps = vacuumCaps(vm.stateObj);
    const showControls = size !== "1x1";

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .name=${vm.name}
        .stateText=${vm.displayState}
        .secondary=${vm.secondary ?? ""}
        .size=${size}
        .accent=${vm.accent}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${size === "1x1" ? "toggle" : "none"}
        .quickLabel=${vm.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${showControls ? this._controls(caps) : nothing} ${size === "2x2" ? this._fanSpeed() : nothing}
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-vacuum": VacuumWidget;
  }
}
