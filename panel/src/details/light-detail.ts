import { html, nothing, type TemplateResult } from "lit";
import { lightCaps } from "../home-assistant/capabilities.js";
import {
  buildLightBrightness,
  buildLightTurnOn,
  buildToggle,
} from "../home-assistant/service-calls.js";
import { titleCase } from "../home-assistant/state-formatting.js";
import type { HassEntity } from "../types/hass.js";
import type { DetailContext } from "./detail-context.js";

const COLOR_SWATCHES: Array<[string, [number, number, number]]> = [
  ["Warm white", [255, 197, 143]],
  ["Sun", [255, 233, 170]],
  ["Red", [255, 74, 74]],
  ["Orange", [255, 145, 48]],
  ["Green", [86, 200, 90]],
  ["Teal", [40, 200, 180]],
  ["Blue", [70, 130, 255]],
  ["Indigo", [120, 90, 240]],
  ["Pink", [255, 92, 170]],
];

/** RGB (0..255) to hue/saturation, used to seed the colour wheel. */
export function rgbToHs(rgb: [number, number, number]): [number, number] {
  const [r, g, b] = rgb.map((value) => value / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue *= 60;
    if (hue < 0) hue += 360;
  }
  const saturation = max === 0 ? 0 : (delta / max) * 100;
  return [Math.round(hue), Math.round(saturation)];
}

export function renderLightDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const caps = lightCaps(state);
  const on = state.state === "on";
  const brightness = on
    ? Math.round(((state.attributes.brightness as number) ?? 255) / 2.55)
    : 0;
  const min = (state.attributes.min_color_temp_kelvin as number) ?? 2200;
  const max = (state.attributes.max_color_temp_kelvin as number) ?? 6500;
  const currentTemperature = (state.attributes.color_temp_kelvin as number) ??
    Math.round((min + max) / 2);
  const effects = (state.attributes.effect_list as string[] | undefined)
    ?.filter((effect) => effect && effect !== "None") ?? [];
  const hs = state.attributes.hs_color as [number, number] | undefined;
  const rgb = state.attributes.rgb_color as [number, number, number] | undefined;
  const [wheelHue, wheelSaturation] = hs
    ? [hs[0], hs[1]]
    : rgb
      ? rgbToHs(rgb)
      : [0, 0];

  return html`
    <div class="d-section d-row-between">
      <span class="d-label">Power</span>
      <hd-toggle
        .checked=${on}
        label="Toggle light"
        @hd-toggle=${() => ctx.call(buildToggle(ctx.entityId), "toggle")}
      ></hd-toggle>
    </div>

    ${caps.brightness
      ? html`<div class="d-section">
          <span class="d-label">Brightness</span>
          <hd-slider
            .value=${brightness}
            .min=${1}
            .max=${100}
            .disabled=${!on}
            .valueText=${on ? `${brightness}%` : "Off"}
            .color=${"var(--state-light)"}
            icon="mdi:brightness-6"
            label="Brightness"
            @hd-change=${(event: CustomEvent) =>
              ctx.call(buildLightBrightness(ctx.entityId, event.detail.value), "dim")}
          ></hd-slider>
        </div>`
      : nothing}

    ${caps.colorTemp
      ? html`<div class="d-section">
          <span class="d-label">Color temperature</span>
          <hd-slider
            .value=${currentTemperature}
            .min=${min}
            .max=${max}
            .step=${50}
            .disabled=${!on}
            .color=${"linear-gradient(90deg,#ffb85c,#fff5e8,#cfe0ff)"}
            label="Color temperature"
            @hd-change=${(event: CustomEvent) => ctx.call(
              buildLightTurnOn(ctx.entityId, { colorTempKelvin: event.detail.value }),
              "set color of",
            )}
          ></hd-slider>
        </div>`
      : nothing}

    ${caps.color
      ? html`<div class="d-section">
          <span class="d-label">Color</span>
          <div class="color-wheel-wrap">
            <hd-color-wheel
              .hue=${wheelHue}
              .sat=${wheelSaturation}
              .disabled=${!on}
              @hd-color=${(event: CustomEvent) => ctx.call(
                buildLightTurnOn(ctx.entityId, { hsColor: [event.detail.hue, event.detail.sat] }),
                "set color of",
              )}
            ></hd-color-wheel>
          </div>
          <div class="swatches">
            ${COLOR_SWATCHES.map(
              ([name, color]) => html`<button
                class="swatch"
                style=${`background:rgb(${color[0]},${color[1]},${color[2]})`}
                aria-label=${name}
                ?disabled=${!on}
                @click=${() => ctx.call(
                  buildLightTurnOn(ctx.entityId, { rgbColor: color }),
                  "set color of",
                )}
              ></button>`,
            )}
          </div>
        </div>`
      : nothing}

    ${caps.effects && effects.length
      ? html`<div class="d-section">
          <span class="d-label">Effect</span>
          <div class="chips">
            ${effects.slice(0, 12).map(
              (effect) => html`<button
                class="chip ${state.attributes.effect === effect ? "active" : ""}"
                ?disabled=${!on}
                @click=${() => ctx.call(
                  buildLightTurnOn(ctx.entityId, { effect }),
                  "set effect of",
                )}
              >
                ${titleCase(effect)}
              </button>`,
            )}
          </div>
        </div>`
      : nothing}
  `;
}
