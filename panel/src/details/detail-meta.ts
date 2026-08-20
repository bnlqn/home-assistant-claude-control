import { html, type TemplateResult } from "lit";
import {
  formatAttribute,
  relativeTime,
  titleCase,
} from "../home-assistant/state-formatting.js";
import type { HassEntity } from "../types/hass.js";
import type { DetailContext } from "./detail-context.js";

/** Shared read-only entity metadata used by generic and sensor details. */
export function renderDetailMeta(ctx: DetailContext, state: HassEntity): TemplateResult {
  const keys = ["device_class", "state_class", "unit_of_measurement"]
    .filter((key) => state.attributes[key] != null);
  return html`<div class="d-grid">
    ${keys.map((key) => html`<div class="d-cell">
      <span class="k">${titleCase(key)}</span>
      <span class="v">${formatAttribute(ctx.hass, state, key)}</span>
    </div>`)}
    <div class="d-cell">
      <span class="k">Last updated</span>
      <span class="v">${relativeTime(state.last_updated)}</span>
    </div>
  </div>`;
}
