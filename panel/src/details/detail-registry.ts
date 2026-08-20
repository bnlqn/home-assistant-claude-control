import type { TemplateResult } from "lit";
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

type DetailRenderer = (context: DetailContext, state: HassEntity) => TemplateResult;

/** Registered detail implementations selected by pure widget-definition keys. */
const DETAIL_RENDERERS = {
  light: renderLightDetail,
  climate: renderClimateDetail,
  generic: renderGenericDetail,
  cover: renderCoverDetail,
  lock: renderLockDetail,
  vacuum: renderVacuumDetail,
  media: renderMediaDetail,
} satisfies Record<WidgetDetailRenderer, DetailRenderer>;

export function renderDefinedDetail(
  renderer: WidgetDetailRenderer,
  context: DetailContext,
  state: HassEntity,
): TemplateResult {
  return DETAIL_RENDERERS[renderer](context, state);
}
