import { html } from "lit";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import type { HomeAssistant } from "../types/hass.js";
import type { WidgetConfig, WidgetSize } from "../config/schema.js";
import { widgetTag } from "../widgets/widget-registry.js";
import { spanForSize } from "./layout.js";
import "../widgets/widget-frame.js";

/** How a widget's tiles should render inside its container (see widget-frame). */
export type TileLayout = "row" | "tile" | "value";

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
  size: WidgetSize,
  columns: number,
  hass: HomeAssistant | undefined,
  layout: TileLayout = "row",
) {
  try {
    const { colSpan, rowSpan } = spanForSize(size, columns);
    const tag = unsafeStatic(widgetTag(widget.type));
    const cellStyle = `grid-column: span ${colSpan}; grid-row: span ${rowSpan};`;
    return staticHtml`<${tag}
      class="cell"
      style=${cellStyle}
      .hass=${hass}
      .config=${widget}
      .currentSize=${size}
      .layout=${layout}
    ></${tag}>`;
  } catch (err) {
    console.error(`[widget-cell] widget "${widget?.id ?? widget?.type}" failed to render:`, err);
    return errorCell(widget, size, columns);
  }
}

/** Card-styled fallback for a widget the cell couldn't even construct. */
export function errorCell(widget: WidgetConfig, size: WidgetSize, columns: number) {
  let colSpan = 1;
  let rowSpan = 1;
  try {
    ({ colSpan, rowSpan } = spanForSize(size, columns));
  } catch {
    /* keep the 1×1 fallback */
  }
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
