import { html, type TemplateResult } from "lit";
import type { WidgetConfig } from "../config/schema.js";
import { renderClimateDetail } from "./climate-detail.js";
import type { DetailContext } from "./detail-context.js";
import {
  renderCoverDetail,
  renderGenericDetail,
  renderLockDetail,
  renderVacuumDetail,
} from "./device-detail.js";
import {
  renderEnergyDetail,
  renderPowerflowDetail,
  renderSolarChargingDetail,
} from "./energy-detail.js";
import { renderLightDetail } from "./light-detail.js";
import { renderMediaDetail } from "./media-detail.js";
import { renderSensorDetail, renderWeatherDetail } from "./sensor-detail.js";

/** Route legacy/unregistered widget details to their independent domain module. */
export function renderDetailBody(ctx: DetailContext): TemplateResult {
  const state = ctx.hass.states[ctx.entityId];
  const type = ctx.config?.type;
  if (type === "energy") return renderEnergyDetail(ctx);
  if (type === "powerflow") return renderPowerflowDetail(ctx);
  if (type === "solarcharging") return renderSolarChargingDetail(ctx);
  if (!state) {
    return html`<div class="d-value big">Entity unavailable</div>
      <div class="d-meta">
        ${ctx.entityId || "No entity configured"} was not found in Home Assistant.
      </div>`;
  }
  const domain = ctx.entityId.split(".")[0];
  switch (domain) {
    case "light":
      return renderLightDetail(ctx, state);
    case "climate":
      return renderClimateDetail(ctx, state);
    case "media_player":
      return renderMediaDetail(ctx, state);
    case "cover":
      return renderCoverDetail(ctx, state);
    case "lock":
      return renderLockDetail(ctx, state);
    case "vacuum":
      return renderVacuumDetail(ctx, state);
    case "sensor":
      return renderSensorDetail(ctx, state);
    case "weather":
      return renderWeatherDetail(ctx, state);
    default:
      return renderGenericDetail(ctx, state);
  }
}

/** Domains whose detail benefits from lazily loaded 24-hour history. */
export function detailNeedsHistory(entityId: string, config?: WidgetConfig): string | null {
  if (config?.type === "energy") return config.options?.gridPower ?? null;
  if (config?.type === "powerflow") return config.options?.gridPower ?? null;
  const domain = entityId.split(".")[0];
  return domain === "sensor" ? entityId : null;
}

export function detailNeedsForecast(entityId: string): boolean {
  return entityId.split(".")[0] === "weather";
}
