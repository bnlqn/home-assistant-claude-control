import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { GroupOptions, SectionKind, WidgetConfig } from "../config/schema.js";
import {
  gridMetricsForProfile,
  resolveWidgetPlacement,
  sectionColumns,
  sectionForWidgetType,
  squareUnit,
  type DisplayProfile,
} from "../panel/layout.js";
import { renderWidgetCell } from "../panel/widget-cell.js";
import { ResponsiveProfileController } from "../controllers/responsive-profile-controller.js";

/**
 * A section container. Renders a heading plus its own internal responsive grid
 * of child widgets. The panel's shared display profile determines its columns
 * and widget footprints; local width is used only to calculate square row
 * units while sections remain nested during the Phase 2 migration.
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
  @property({ attribute: false }) displayProfile: DisplayProfile = "desktop";

  private readonly _responsive = new ResponsiveProfileController(this, (width) => width);

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
    return this.config.type === "group" ? this.config.options : {};
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

    const width = this._responsive.width;
    const variant = this._variant;
    const metrics = gridMetricsForProfile(this.displayProfile);
    const cols = sectionColumns(variant, this.displayProfile);
    const gap = metrics.gap;
    const label = this._opts.label;

    // Row height per variant: value tiles are short wide rows, the media hero a
    // fixed-height bar, and device/energy cells square (1×1 reads as a square).
    const unit =
      variant === "sensors"
        ? 84
        : variant === "media"
          ? 116
          : variant === "tiles"
            ? 100 // wide status cards (icon + name + "value • status"); name may wrap
            : squareUnit(width || 1024, { ...metrics, columns: cols, pad: 0 });

    const gridStyle = `--cols:${cols}; --gap:${gap}px; --unit:${unit}px`;

    return html`
      <section class="section">
        ${label ? html`<h2 class="head">${label}</h2>` : nothing}
        <div class="grid" style=${gridStyle}>
          ${repeat(
            children,
            (c) => c.id,
            (c) => renderWidgetCell(
              c,
              resolveWidgetPlacement(c, this.displayProfile, cols, variant),
              this.hass,
            ),
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
