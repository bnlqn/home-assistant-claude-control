import { html, nothing, type TemplateResult } from "lit";
import { climateCaps } from "../home-assistant/capabilities.js";
import {
  buildClimateFanMode,
  buildClimateHvacMode,
  buildClimatePreset,
  buildClimateSwing,
  buildClimateTemperature,
  buildToggle,
} from "../home-assistant/service-calls.js";
import { formatNumber, titleCase } from "../home-assistant/state-formatting.js";
import type { SegmentOption } from "../primitives/segmented.js";
import type { HassEntity } from "../types/hass.js";
import type { DetailContext } from "./detail-context.js";

export function renderClimateDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const caps = climateCaps(state);
  const off = state.state === "off";
  const target = (state.attributes.temperature as number) ?? 20;
  const current = state.attributes.current_temperature as number | undefined;
  const stepSize = (state.attributes.target_temp_step as number) ?? 0.5;
  const modes = (state.attributes.hvac_modes as string[]) ?? [];
  const fanModes = (state.attributes.fan_modes as string[]) ?? [];
  const swingModes = (state.attributes.swing_modes as string[]) ?? [];
  const presets = (state.attributes.preset_modes as string[]) ?? [];
  const controls = (
    ctx.config?.type === "climate" ? ctx.config.options?.switches ?? [] : []
  ).filter((control) => ctx.hass.states[control.entity]);

  const step = (direction: number) => {
    const min = (state.attributes.min_temp as number) ?? 7;
    const max = (state.attributes.max_temp as number) ?? 35;
    const next = Math.min(max, Math.max(min, target + direction * stepSize));
    void ctx.call(
      buildClimateTemperature(ctx.entityId, Number(next.toFixed(1))),
      "set temperature for",
    );
  };
  const segments = (values: string[]): SegmentOption[] =>
    values.map((value) => ({ value, label: titleCase(value) }));

  return html`
    ${caps.targetTemp
      ? html`<div class="d-section climate-hero">
          <hd-icon-button
            icon="mdi:minus"
            label="Lower"
            variant="soft"
            .disabled=${off}
            @click=${() => step(-1)}
          ></hd-icon-button>
          <div class="climate-target">
            <span class="big">${off ? "—" : `${formatNumber(target)}°`}</span>
            ${current != null
              ? html`<span class="sub">Now ${formatNumber(current)}°</span>`
              : nothing}
          </div>
          <hd-icon-button
            icon="mdi:plus"
            label="Raise"
            variant="soft"
            .disabled=${off}
            @click=${() => step(1)}
          ></hd-icon-button>
        </div>`
      : nothing}

    ${modes.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Mode</span>
          <hd-segmented
            .options=${segments(modes)}
            .value=${state.state}
            label="Mode"
            @hd-select=${(event: CustomEvent) => ctx.call(
              buildClimateHvacMode(ctx.entityId, event.detail.value),
              "set mode for",
            )}
          ></hd-segmented>
        </div>`
      : nothing}
    ${caps.fanMode && fanModes.length
      ? html`<div class="d-section">
          <span class="d-label">Fan</span>
          <hd-segmented
            .options=${segments(fanModes)}
            .value=${(state.attributes.fan_mode as string) ?? ""}
            label="Fan mode"
            @hd-select=${(event: CustomEvent) => ctx.call(
              buildClimateFanMode(ctx.entityId, event.detail.value),
              "set fan for",
            )}
          ></hd-segmented>
        </div>`
      : nothing}
    ${caps.swingMode && swingModes.length
      ? html`<div class="d-section">
          <span class="d-label">Swing</span>
          <hd-segmented
            .options=${segments(swingModes)}
            .value=${(state.attributes.swing_mode as string) ?? ""}
            label="Swing mode"
            @hd-select=${(event: CustomEvent) => ctx.call(
              buildClimateSwing(ctx.entityId, event.detail.value),
              "set swing for",
            )}
          ></hd-segmented>
        </div>`
      : nothing}
    ${caps.presetMode && presets.length
      ? html`<div class="d-section">
          <span class="d-label">Preset</span>
          <hd-segmented
            .options=${segments(presets)}
            .value=${(state.attributes.preset_mode as string) ?? ""}
            label="Preset"
            @hd-select=${(event: CustomEvent) => ctx.call(
              buildClimatePreset(ctx.entityId, event.detail.value),
              "set preset for",
            )}
          ></hd-segmented>
        </div>`
      : nothing}

    ${controls.map((control) => {
      const on = ctx.hass.states[control.entity]!.state === "on";
      return html`<div class="d-section d-row-between">
        <span class="d-label">${control.name}</span>
        <hd-toggle
          .checked=${on}
          label=${control.name}
          @hd-toggle=${() => ctx.call(
            buildToggle(control.entity),
            `toggle ${control.name.toLowerCase()}`,
          )}
        ></hd-toggle>
      </div>`;
    })}
  `;
}
