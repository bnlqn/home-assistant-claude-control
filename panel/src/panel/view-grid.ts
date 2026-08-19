import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { Breakpoint, ViewConfig, WidgetConfig, WidgetSize } from "../config/schema.js";
import { widgetTag } from "../widgets/widget-registry.js";
import { gridMetricsForWidth, resolveWidgetSize, spanForSize, squareUnit } from "./layout.js";
import "../primitives/entity-icon.js";
import "../widgets/widget-frame.js";

/**
 * The deterministic square-unit widget grid. Column count, gap, padding and the
 * responsive size bucket are all derived from the PANEL's own measured width
 * (via ResizeObserver), not the screen — so the layout adapts correctly inside
 * a sidebar-narrowed panel or a wall display. Configured widget order is always
 * preserved (no dense packing).
 */
@define("hd-view-grid")
export class HdViewGrid extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) view?: ViewConfig;

  @state() private _width = 0;
  private _ro?: ResizeObserver;

  static styles = css`
    :host {
      display: block;
    }
    .grid {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
      grid-auto-rows: var(--unit, 150px);
      gap: var(--gap, 14px);
      padding: var(--pad, 20px);
      box-sizing: border-box;
      max-width: 1760px;
      margin: 0 auto;
    }
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: var(--text-tertiary);
      text-align: center;
      padding: 64px 24px;
    }
    .empty h3 {
      margin: 0;
      font: var(--text-widget-title);
      color: var(--text-secondary);
    }
    .empty p {
      margin: 0;
      font: var(--text-secondary-state);
      max-width: 34ch;
    }
    .cell {
      min-width: 0;
      min-height: 0;
    }
  `;

  connectedCallback(): void {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width);
      if (w && Math.abs(w - this._width) > 1) this._width = w;
    });
    this._ro.observe(this);
    this._width = this.getBoundingClientRect().width || window.innerWidth;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
  }

  private _sizeFor(widget: WidgetConfig, bucket: Breakpoint): WidgetSize {
    return resolveWidgetSize(widget, bucket);
  }

  private _renderWidget(widget: WidgetConfig, size: WidgetSize, columns: number) {
    // Grid-level error net: a throw here — an unknown widget type, a bad config,
    // a span computation gone wrong — degrades this one cell to an error tile
    // instead of throwing out of render() and blanking the entire view. A
    // widget's *own* render throw is caught one layer down by EntityWidget.
    try {
      const { colSpan, rowSpan } = spanForSize(size, columns);
      const tag = unsafeStatic(widgetTag(widget.type));
      const cellStyle = `grid-column: span ${colSpan}; grid-row: span ${rowSpan};`;
      // Dynamic-tag element with live property bindings.
      return staticHtml`<${tag}
        class="cell"
        style=${cellStyle}
        .hass=${this.hass}
        .config=${widget}
        .currentSize=${size}
      ></${tag}>`;
    } catch (err) {
      console.error(`[hd-view-grid] widget "${widget?.id ?? widget?.type}" failed to render:`, err);
      return this._errorCell(widget, size, columns);
    }
  }

  /** Card-styled fallback for a widget the grid couldn't even construct. */
  private _errorCell(widget: WidgetConfig, size: WidgetSize, columns: number) {
    // `spanForSize` may itself have thrown above — fall back to a 1×1 footprint.
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

  render() {
    const view = this.view;
    const m = gridMetricsForWidth(this._width);
    const gridStyle = `--cols:${m.columns}; --gap:${m.gap}px; --pad:${m.pad}px; --unit:var(--auto-unit)`;

    if (!view || view.widgets.length === 0) {
      return html`<div class="empty">
        <hd-icon icon="mdi:view-dashboard-outline" .size=${40}></hd-icon>
        <h3>No widgets yet</h3>
        <p>Add widgets to this view in <code>dashboard.config.ts</code>.</p>
      </div>`;
    }

    // Compute a square unit from the measured width so 1×1 ≈ square.
    const unit = squareUnit(this._width, m);
    const styleWithUnit = `${gridStyle.replace("var(--auto-unit)", `${unit}px`)}`;

    return html`
      <div class="grid" style=${styleWithUnit}>
        ${repeat(
          view.widgets,
          (w) => w.id,
          (w) => this._renderWidget(w, this._sizeFor(w, m.bucket), m.columns),
        )}
      </div>
      ${nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-view-grid": HdViewGrid;
  }
}
