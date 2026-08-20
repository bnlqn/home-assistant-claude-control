import type { TemplateResult } from "lit";
import type { HassEntity } from "../types/hass.js";
import type { WidgetDetailRenderer } from "../widgets/widget-definition.js";
import { renderClimateDetail } from "./climate-detail.js";
import type { DetailContext } from "./detail-context.js";
import { renderLightDetail } from "./light-detail.js";

type DetailRenderer = (context: DetailContext, state: HassEntity) => TemplateResult;

/** Registered detail implementations selected by pure widget-definition keys. */
const DETAIL_RENDERERS = {
  light: renderLightDetail,
  climate: renderClimateDetail,
} satisfies Record<WidgetDetailRenderer, DetailRenderer>;

export function renderDefinedDetail(
  renderer: WidgetDetailRenderer,
  context: DetailContext,
  state: HassEntity,
): TemplateResult {
  return DETAIL_RENDERERS[renderer](context, state);
}
