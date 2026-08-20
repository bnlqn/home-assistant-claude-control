import { html, nothing, type TemplateResult } from "lit";
import {
  buildNumberSet,
  buildToggle,
} from "../home-assistant/service-calls.js";
import {
  formatNumber,
  formatState,
  titleCase,
} from "../home-assistant/state-formatting.js";
import { buildFlowModel } from "../widgets/powerflow.js";
import { buildSolarChargingModel } from "../widgets/solarcharging.js";
import type { DetailContext } from "./detail-context.js";

export function renderEnergyDetail(ctx: DetailContext): TemplateResult {
  const options = ctx.config?.type === "energy" ? ctx.config.options ?? {} : {};
  const state = (entityId?: string) => entityId
    ? ctx.hass.states[entityId] ?? null
    : null;
  const rows = Object.entries(options)
    .map(([key, entityId]) => ({ key, state: state(entityId) }))
    .filter((row) => row.state);
  return html`
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${rows.map((row) => html`<div class="d-cell">
          <span class="k">${titleCase(row.key)}</span>
          <span class="v">${formatState(ctx.hass, row.state!)}</span>
        </div>`)}
      </div>
    </div>
    ${ctx.trend.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend">
            <hd-trend .points=${ctx.trend} .summary=${"24 hour grid power"}></hd-trend>
          </div>
        </div>`
      : nothing}
  `;
}

export function renderPowerflowDetail(ctx: DetailContext): TemplateResult {
  const options = ctx.config?.type === "powerflow" ? ctx.config.options ?? {} : {};
  const model = buildFlowModel(ctx.hass, options);
  const cell = (label: string, entityId?: string) => {
    const state = entityId ? ctx.hass.states[entityId] : undefined;
    return state
      ? html`<div class="d-cell">
          <span class="k">${label}</span>
          <span class="v">${formatState(ctx.hass, state)}</span>
        </div>`
      : nothing;
  };
  return html`
    <div class="detail-flow"><hd-flow-diagram .model=${model}></hd-flow-diagram></div>
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${cell("Grid", options.gridPower)}
        ${cell("Solar", options.solarPower)}
        ${cell("House", options.houseConsumption)}
        ${cell("Car charger", options.carPower)}
      </div>
    </div>
    ${ctx.trend.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend">
            <hd-trend .points=${ctx.trend} .summary=${"24 hour grid power"}></hd-trend>
          </div>
        </div>`
      : nothing}
  `;
}

export function renderSolarChargingDetail(ctx: DetailContext): TemplateResult {
  const options = ctx.config?.type === "solarcharging"
    ? ctx.config.options ?? {}
    : {};
  const model = buildSolarChargingModel(ctx.hass, options);
  const tone = model.tone === "eco"
    ? "var(--state-eco)"
    : model.tone === "accent"
      ? "var(--accent)"
      : "var(--text-secondary)";
  const cell = (label: string, value: string | null) => value != null
    ? html`<div class="d-cell"><span class="k">${label}</span><span class="v">${value}</span></div>`
    : nothing;

  const threshold = (
    entityId: string | undefined,
    label: string,
    format: (value: number) => string,
    fallback: { min: number; max: number; step: number },
  ) => {
    const state = entityId ? ctx.hass.states[entityId] : undefined;
    if (!entityId || !state) return nothing;
    const value = Number(state.state);
    const min = (state.attributes.min as number) ?? fallback.min;
    const max = (state.attributes.max as number) ?? fallback.max;
    const step = (state.attributes.step as number) ?? fallback.step;
    return html`<div class="d-section">
      <span class="d-label">${label}</span>
      <hd-slider
        .value=${Number.isFinite(value) ? value : min}
        .min=${min}
        .max=${max}
        .step=${step}
        .valueText=${Number.isFinite(value) ? format(value) : "—"}
        label=${label}
        @hd-change=${(event: CustomEvent) => ctx.call(
          buildNumberSet(entityId, event.detail.value),
          `set ${label.toLowerCase()}`,
        )}
      ></hd-slider>
    </div>`;
  };

  return html`
    <div class="d-section d-row-between">
      <span class="d-label">Solar charging</span>
      <hd-toggle
        .checked=${model.armed}
        label="Toggle solar charging"
        @hd-toggle=${() => options.master
          ? ctx.call(buildToggle(options.master), "toggle solar charging")
          : undefined}
      ></hd-toggle>
    </div>

    <div class="d-section">
      <span class="d-label">Status</span>
      <div class="d-value big" style=${`color:${tone}`}>${model.label}</div>
      <div class="d-grid">
        ${cell("Battery", model.batteryPct != null ? `${Math.round(model.batteryPct)}%` : null)}
        ${cell("Target", model.limitPct != null ? `${Math.round(model.limitPct)}%` : null)}
        ${cell("Power", model.powerKw != null ? `${formatNumber(model.powerKw)} kW` : null)}
        ${cell("Current", model.currentA != null ? `${Math.round(model.currentA)} A` : null)}
        ${cell("Rate", model.rateKmh != null ? `${Math.round(model.rateKmh)} km/h` : null)}
        ${cell("Session", model.sessionKwh != null ? `${formatNumber(model.sessionKwh)} kWh` : null)}
      </div>
    </div>

    ${threshold(
      options.startThreshold,
      "Start above export",
      (value) => `${Math.abs(Math.round(value))} W export`,
      { min: -5000, max: -500, step: 50 },
    )}
    ${threshold(
      options.stopThreshold,
      "Stop above import",
      (value) => `${Math.round(value)} W import`,
      { min: 0, max: 2000, step: 50 },
    )}
    ${threshold(
      options.minCurrent,
      "Min charge current",
      (value) => `${Math.round(value)} A`,
      { min: 5, max: 10, step: 1 },
    )}
    ${threshold(
      options.deadband,
      "Current deadband",
      (value) => `${Math.round(value)} A`,
      { min: 1, max: 5, step: 1 },
    )}
  `;
}
