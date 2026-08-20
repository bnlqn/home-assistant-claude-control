import { html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import type { HomeAssistant } from "../types/hass.js";
import type { WidgetConfig } from "../config/schema.js";
import { widgetTag } from "../widgets/widget-registry.js";
import type { WidgetPlacement } from "./layout.js";
import "../widgets/widget-frame.js";

/**
 * Render one widget as a grid cell: a dynamically-tagged widget element with
 * live property bindings and a `grid-column`/`grid-row` span, wrapped in an
 * error net. A throw while *constructing* the cell — an unknown widget type, a
 * bad span — degrades to a single error tile instead of blanking the whole
 * grid. (A widget's own render throw is caught one layer down by EntityWidget.)
 *
 * Shared by the outer view grid and every `hd-group` container so both build
 * cells identically.
 */
export function renderWidgetCell(
  widget: WidgetConfig,
  placement: WidgetPlacement,
  hass: HomeAssistant | undefined,
) {
  try {
    const { colSpan, rowSpan, size, layout, profile } = placement;
    const tag = unsafeStatic(widgetTag(widget.type));
    const cellStyle = `grid-column: span ${colSpan}; grid-row: span ${rowSpan};`;
    return staticHtml`<${tag}
      class="cell"
      style=${cellStyle}
      .hass=${hass}
      .config=${widget}
      .currentSize=${size}
      .layout=${layout}
      .displayProfile=${profile}
    ></${tag}>`;
  } catch (err) {
    console.error(`[widget-cell] widget "${widget?.id ?? widget?.type}" failed to render:`, err);
    return errorCell(widget, placement);
  }
}

/** Card-styled fallback for a widget the cell couldn't even construct. */
export function errorCell(widget: WidgetConfig, placement: WidgetPlacement) {
  const { colSpan, rowSpan, size } = placement;
  const cellStyle = `grid-column: span ${colSpan}; grid-row: span ${rowSpan};`;
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
