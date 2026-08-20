import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { GroupOptions, SectionKind, WidgetConfig } from "../config/schema.js";
import {
  breakoutSizeFor,
  gridMetricsForWidth,
  layoutForVariant,
  resolveWidgetSize,
  sectionColumns,
  sectionForWidgetType,
  squareUnit,
} from "../panel/layout.js";
import { renderWidgetCell } from "../panel/widget-cell.js";
import { ElementWidthController } from "../panel/element-width-controller.js";

/**
 * A section container. Renders a heading plus its own internal responsive grid
 * of child widgets. Crucially, the grid reflows against the CONTAINER's own
 * measured width (through the shared element-width controller), so a section
 * renders with identical tiles everywhere and simply gains columns as it gets
 * wider — the density logic lives here, not in the outer grid.
 *
 * It is not a card: the section sits transparently on the canvas and each child
 * tile is the card, matching the Homey layout. Child widgets keep their own
 * quick-action / detail events, which bubble (composed) up to the panel root.
 */
@define("hd-group")
export class HdGroup extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) config!: WidgetConfig;
  /** Present for interface parity with widgets; a container ignores it. */
  @property({ type: String }) currentSize = "4x2";
  @property({ type: String }) layout: "row" | "tile" | "value" = "row";

  private readonly _elementWidth = new ElementWidthController(this);

  static styles = css`
    :host {
      display: block;
      grid-column: 1 / -1;
    }
    .section {
      display: block;
    }
    .head {
      margin: 0 0 12px 2px;
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 17px;
      color: var(--text-primary);
    }
    .grid {
      display: grid;
      grid-auto-flow: row;
      grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr));
      grid-auto-rows: var(--unit, 120px);
      gap: var(--gap, 12px);
    }
    .cell {
      min-width: 0;
      min-height: 0;
    }
  `;

  private get _opts(): GroupOptions {
    return (this.config?.options ?? {}) as GroupOptions;
  }

  private get _children(): WidgetConfig[] {
    return this._opts.children ?? [];
  }

  private get _variant(): SectionKind {
    return this._opts.variant ?? sectionForWidgetType(this._children[0]?.type ?? "sensor");
  }

  render() {
    const children = this._children;
    if (!children.length) return nothing;

    const width = this._elementWidth.width;
    const variant = this._variant;
    const cols = sectionColumns(variant, width);
    const gap = 12;
    const bucket = gridMetricsForWidth(width).bucket;
    const cellLayout = layoutForVariant(variant);
    const label = this._opts.label;

    // Tile/value sections are uniform glanceable grids (like the mock) — every
    // child is 1×1 and its controls live in the detail surface. Media and energy
    // keep their configured footprints (hero art tile, wide diagrams).
    const uniform = cellLayout !== "row";

    // Row height per variant: value tiles are short wide rows, the media hero a
    // fixed-height bar, and device/energy cells square (1×1 reads as a square).
    const unit =
      variant === "sensors"
        ? 84
        : variant === "media"
          ? 116
          : variant === "tiles"
            ? 100 // wide status cards (icon + name + "value • status"); name may wrap
            : squareUnit(width || 1024, { columns: cols, gap, pad: 0, bucket });

    const gridStyle = `--cols:${cols}; --gap:${gap}px; --unit:${unit}px`;

    return html`
      <section class="section">
        ${label ? html`<h2 class="head">${label}</h2>` : nothing}
        <div class="grid" style=${gridStyle}>
          ${repeat(
            children,
            (c) => c.id,
            (c) => {
              // A uniform tile section renders every child as a 1×1 square —
              // unless the child brings its own full-bleed hero surface, which
              // breaks out to its declared footprint with a body-owning layout.
              const breakout = uniform ? breakoutSizeFor(c, bucket) : null;
              return renderWidgetCell(
                c,
                breakout ?? (uniform ? "1x1" : resolveWidgetSize(c, bucket)),
                cols,
                this.hass,
                breakout ? "row" : cellLayout,
              );
            },
          )}
        </div>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-group": HdGroup;
  }
}
