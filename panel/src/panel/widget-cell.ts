import { html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import type { HomeAssistant } from "../types/hass.js";
import type { WidgetConfig } from "../config/schema.js";
import { widgetTag } from "../widgets/widget-registry.js";
import type { WidgetPlacement } from "./layout.js";
import type { EnergyPeriodContext } from "../energy/energy-period.js";
import "../widgets/widget-frame.js";

export interface GridPosition {
  columnStart: number;
  rowStart: number;
}

/**
 * Render one widget as a grid cell: a dynamically-tagged widget element with
 * live property bindings and a `grid-column`/`grid-row` span, wrapped in an
 * error net. A throw while *constructing* the cell — an unknown widget type, a
 * bad span — degrades to a single error tile instead of blanking the whole
 * grid. (A widget's own render throw is caught one layer down by EntityWidget.)
 *
 * The page grid supplies the resolved placement and optional explicit start
 * position, keeping custom-element construction independent from packing.
 */
export function renderWidgetCell(
  widget: WidgetConfig,
  placement: WidgetPlacement,
  hass: HomeAssistant | undefined,
  position?: GridPosition,
  energyPeriod?: EnergyPeriodContext,
) {
  try {
    const { colSpan, rowSpan, size, layout, profile } = placement;
    const tag = unsafeStatic(widgetTag(widget.type));
    const cellStyle = position
      ? `grid-column: ${position.columnStart} / span ${colSpan}; grid-row: ${position.rowStart} / span ${rowSpan};`
      : `grid-column: span ${colSpan}; grid-row: span ${rowSpan};`;
    return staticHtml`<${tag}
      class="cell"
      style=${cellStyle}
      .hass=${hass}
      .config=${widget}
      .currentSize=${size}
      .layout=${layout}
      .displayProfile=${profile}
      .energyPeriod=${energyPeriod}
    ></${tag}>`;
  } catch (err) {
    console.error(`[widget-cell] widget "${widget?.id ?? widget?.type}" failed to render:`, err);
    return errorCell(widget, placement, position);
  }
}

/** Card-styled fallback for a widget the cell couldn't even construct. */
export function errorCell(widget: WidgetConfig, placement: WidgetPlacement, position?: GridPosition) {
  const { colSpan, rowSpan, size } = placement;
  const cellStyle = position
    ? `grid-column: ${position.columnStart} / span ${colSpan}; grid-row: ${position.rowStart} / span ${rowSpan};`
    : `grid-column: span ${colSpan}; grid-row: span ${rowSpan};`;
  const name = widget?.name || widget?.entity || "Widget";
  return html`<hd-widget-frame
    class="cell"
    style=${cellStyle}
    icon="mdi:alert-circle-outline"
    .name=${name}
    stateText="Unavailable"
    secondary="Widget error"
    accent="alert"
    .size=${size}
    ?unavailable=${true}
  ></hd-widget-frame>`;
}
