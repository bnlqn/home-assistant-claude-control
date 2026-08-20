import { LitElement, css, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { ViewConfig } from "../config/schema.js";
import { gridMetricsForWidth, resolveWidgetSize, sectioniseView } from "./layout.js";
import { renderWidgetCell } from "./widget-cell.js";
import "../primitives/entity-icon.js";
import "../widgets/widget-frame.js";
import "../widgets/group.js";

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

  @state() private _width = 0;
  private _ro?: ResizeObserver;

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

  render() {
    const view = this.view;
    const m = gridMetricsForWidth(this._width);
    const stackStyle = `--pad:${m.pad}px`;

    if (!view || view.widgets.length === 0) {
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
      <div class="stack" style=${stackStyle}>
        ${repeat(
          items,
          (w) => w.id,
          (w) => renderWidgetCell(w, resolveWidgetSize(w, m.bucket), 1, this.hass, "row"),
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
