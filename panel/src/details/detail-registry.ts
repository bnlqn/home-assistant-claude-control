import { html, type TemplateResult } from "lit";
import type { HassEntity } from "../types/hass.js";
import type { WidgetDetailRenderer } from "../widgets/widget-definition.js";
import { renderClimateDetail } from "./climate-detail.js";
import type { DetailContext } from "./detail-context.js";
import {
  renderCoverDetail,
  renderGenericDetail,
  renderLockDetail,
  renderVacuumDetail,
} from "./device-detail.js";
import { renderLightDetail } from "./light-detail.js";
import { renderMediaDetail } from "./media-detail.js";
import { renderSensorDetail, renderWeatherDetail } from "./sensor-detail.js";
import {
  renderEnergyDetail,
  renderPowerflowDetail,
  renderSolarChargingDetail,
} from "./energy-detail.js";

type DetailRenderer = (context: DetailContext, state?: HassEntity) => TemplateResult;
type EntityDetailRenderer = (context: DetailContext, state: HassEntity) => TemplateResult;

const withEntity = (renderer: EntityDetailRenderer): DetailRenderer =>
  (context, state) => state
    ? renderer(context, state)
    : html`<div class="d-value big">Entity unavailable</div>
        <div class="d-meta">${context.entityId || "No entity configured"} was not found in Home Assistant.</div>`;

/** Registered detail implementations selected by pure widget-definition keys. */
const DETAIL_RENDERERS = {
  light: withEntity(renderLightDetail),
  climate: withEntity(renderClimateDetail),
  generic: withEntity(renderGenericDetail),
  cover: withEntity(renderCoverDetail),
  lock: withEntity(renderLockDetail),
  vacuum: withEntity(renderVacuumDetail),
  media: withEntity(renderMediaDetail),
  sensor: withEntity(renderSensorDetail),
  weather: withEntity(renderWeatherDetail),
  energy: renderEnergyDetail,
  powerflow: renderPowerflowDetail,
  solarcharging: renderSolarChargingDetail,
} satisfies Record<WidgetDetailRenderer, DetailRenderer>;

export function renderDefinedDetail(
  renderer: WidgetDetailRenderer,
  context: DetailContext,
  state?: HassEntity,
): TemplateResult {
  return DETAIL_RENDERERS[renderer](context, state);
}
