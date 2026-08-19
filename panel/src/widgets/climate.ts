import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { climateCaps } from "../home-assistant/capabilities.js";
import { buildClimateHvacMode, buildClimateTemperature } from "../home-assistant/service-calls.js";
import { titleCase, formatNumber } from "../home-assistant/state-formatting.js";
import type { SegmentOption } from "../primitives/segmented.js";
import "./widget-frame.js";
import "../primitives/icon-button.js";
import "../primitives/segmented.js";

const MODE_ICON: Record<string, string> = {
  off: "mdi:power",
  heat: "mdi:fire",
  cool: "mdi:snowflake",
  heat_cool: "mdi:thermostat-auto",
  auto: "mdi:thermostat-auto",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan",
};

/**
 * Climate / thermostat widget. A target-temperature stepper on every size, plus
 * an HVAC-mode selector on 2×2. Full fan/swing/preset control lives in the
 * detail surface. Only capabilities the entity advertises are shown.
 */
@define("hd-widget-climate")
export class ClimateWidget extends EntityWidget {
  @state() private _optimisticTarget: number | null = null;
  private _optimisticTs = 0;
  private _debounce = 0;

  static styles = css`
    .stepper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .stepper.center {
      justify-content: center;
      gap: 16px;
    }
    .target {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
      min-width: 4ch;
      text-align: center;
    }
    .now {
      font: var(--text-meta);
      color: var(--text-tertiary);
      text-align: center;
    }
    .modes {
      margin-top: 4px;
    }
  `;

  private get _target(): number {
    const vm = this.vm;
    const live = (vm.stateObj?.attributes.temperature as number) ?? 20;
    if (this._optimisticTarget != null) {
      if (this._optimisticTarget === live || Date.now() - this._optimisticTs > 1600) {
        this._optimisticTarget = null;
        return live;
      }
      return this._optimisticTarget;
    }
    return live;
  }

  private _step(delta: number) {
    const vm = this.vm;
    if (!vm.available || vm.rawState === "off") return;
    const stepSize = (vm.stateObj?.attributes.target_temp_step as number) ?? 0.5;
    const min = (vm.stateObj?.attributes.min_temp as number) ?? 7;
    const max = (vm.stateObj?.attributes.max_temp as number) ?? 35;
    const next = Math.min(max, Math.max(min, this._target + delta * stepSize));
    this._optimisticTarget = Number(next.toFixed(1));
    this._optimisticTs = Date.now();
    this.requestUpdate();
    window.clearTimeout(this._debounce);
    this._debounce = window.setTimeout(() => {
      if (this.entityId) void this.callService(buildClimateTemperature(this.entityId, this._optimisticTarget!), {
        errorVerb: "set temperature for",
      });
    }, 350);
  }

  private _setMode(mode: string) {
    if (this.entityId) void this.callService(buildClimateHvacMode(this.entityId, mode), { errorVerb: "set mode for" });
  }

  private _renderStepper(center: boolean) {
    const vm = this.vm;
    const off = vm.rawState === "off";
    const cur = vm.stateObj?.attributes.current_temperature;
    return html`<div>
      <div class="stepper ${center ? "center" : ""}">
        <hd-icon-button
          icon="mdi:minus"
          label="Lower target temperature"
          variant="soft"
          .disabled=${off || !vm.available}
          @click=${() => this._step(-1)}
        ></hd-icon-button>
        <span class="target">${off ? "—" : `${formatNumber(this._target)}°`}</span>
        <hd-icon-button
          icon="mdi:plus"
          label="Raise target temperature"
          variant="soft"
          .disabled=${off || !vm.available}
          @click=${() => this._step(1)}
        ></hd-icon-button>
      </div>
      ${cur != null ? html`<div class="now">Now ${formatNumber(cur as number)}°</div>` : nothing}
    </div>`;
  }

  private _renderModes() {
    const vm = this.vm;
    const modes = (vm.stateObj?.attributes.hvac_modes as string[] | undefined) ?? [];
    if (modes.length < 2) return nothing;
    const options: SegmentOption[] = modes.map((m) => ({ value: m, icon: MODE_ICON[m] ?? "mdi:thermostat" }));
    return html`<div class="modes">
      <hd-segmented
        .options=${options}
        .value=${vm.rawState}
        .disabled=${!vm.available}
        label="HVAC mode"
        @hd-select=${(e: CustomEvent) => this._setMode(e.detail.value)}
      ></hd-segmented>
    </div>`;
  }

  renderContent() {
    const vm = this.vm;
    const size = this.currentSize;
    const caps = climateCaps(vm.stateObj);
    const showStepper = caps.targetTemp;
    const big = size === "2x2";

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .name=${vm.name}
        .stateText=${titleCase(vm.rawState)}
        .secondary=${vm.secondary ?? ""}
        .size=${size}
        .accent=${vm.accent}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${showStepper ? this._renderStepper(big) : nothing}
        ${big ? this._renderModes() : nothing}
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
    "hd-widget-climate": ClimateWidget;
  }
}
