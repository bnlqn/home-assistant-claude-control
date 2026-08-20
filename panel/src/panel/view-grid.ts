import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { ViewConfig } from "../config/schema.js";
import {
  gridMetricsForProfile,
  resolveWidgetPlacement,
  sectioniseView,
  type DisplayProfile,
} from "./layout.js";
import { renderWidgetCell } from "./widget-cell.js";
import "../primitives/entity-icon.js";
import "../widgets/widget-frame.js";
import "../widgets/group.js";
import "../energy/energy-hero.js";

/**
 * The view canvas. A view's flat widget list is organised by `sectioniseView`
 * into domain sections, each rendered by a self-contained `hd-group` container
 * that owns its own internal responsive grid. The canvas itself is just a
 * vertical stack of those full-width section blocks (plus, in hand-composed
 * views, any standalone widget). Configured widget order is preserved within
 * each section.
 */
@define("hd-view-grid")
export class HdViewGrid extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) view?: ViewConfig;
  @property({ attribute: false }) displayProfile: DisplayProfile = "desktop";

  static styles = css`
    :host {
      display: block;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: 26px;
      padding: var(--pad, 20px);
      box-sizing: border-box;
      max-width: var(--max-width, 1760px);
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

  render() {
    const view = this.view;
    const m = gridMetricsForProfile(this.displayProfile);
    const stackStyle = `--pad:${m.pad}px; --max-width:${m.maxWidth}px`;

    // A page-level hero (the Energy house) renders full-bleed above the grid.
    const hero = view?.hero
      ? html`<hd-energy-hero .hass=${this.hass} .options=${view.hero}></hd-energy-hero>`
      : nothing;

    if (!view || (view.widgets.length === 0 && !view.hero)) {
      return html`<div class="empty">
        <hd-icon icon="mdi:view-dashboard-outline" .size=${40}></hd-icon>
        <h3>No widgets yet</h3>
        <p>Add widgets to this view in <code>dashboard.config.ts</code>.</p>
      </div>`;
    }

    // Organise the flat widget list into section containers (+ any standalone
    // widget in a hand-composed view). Each item renders itself full-width.
    const items = sectioniseView(view.widgets);

    return html`
      ${hero}
      <div class="stack" style=${stackStyle}>
        ${repeat(
          items,
          (w) => w.id,
          (w) => renderWidgetCell(w, resolveWidgetPlacement(w, this.displayProfile, 1), this.hass),
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
