import { LitElement, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { define } from "../primitives/registry.js";
import type { HomeAssistant } from "../types/hass.js";
import type { ViewConfig } from "../config/schema.js";
import type { EnergyPeriodSelection } from "../energy/energy-period.js";
import {
  currentEnergyPeriodSelection,
  energyExpectedBucketStarts,
  energyStatisticIds,
  resolveEnergyPeriod,
  type EnergyPeriodContext,
  type EnergyPeriodRange,
} from "../energy/energy-period.js";
import {
  emptyEnergyStatisticsData,
  fetchEnergyStatistics,
  StatisticsRangeCache,
} from "../home-assistant/statistics.js";
import {
  gridMetricsForProfile,
  packViewGrid,
  squareUnit,
  type DisplayProfile,
} from "./layout.js";
import { renderWidgetCell } from "./widget-cell.js";
import { ResponsiveProfileController } from "../controllers/responsive-profile-controller.js";
import { KeyedAsyncController } from "../controllers/keyed-async-controller.js";
import "../primitives/entity-icon.js";
import "../widgets/widget-frame.js";
import "../energy/energy-hero.js";

/**
 * The view canvas. One page-wide grid owns every widget placement. Domain
 * headings are full-width structural rows in that same grid, and configured
 * order remains identical to DOM, reading, and keyboard order.
 */
@define("hd-view-grid")
export class HdViewGrid extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) view?: ViewConfig;
  @property({ attribute: false }) displayProfile: DisplayProfile = "desktop";
  @property({ attribute: false }) energySelection?: EnergyPeriodSelection;

  private readonly _dimensions = new ResponsiveProfileController(this, (width) => width);
  private readonly _energyStatistics = new KeyedAsyncController(
    this,
    emptyEnergyStatisticsData,
  );
  private readonly _energyStatisticsCache = new StatisticsRangeCache();
  private _energyRefreshTimer = 0;

  static styles = css`
    :host {
      display: block;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(var(--cols, 2), minmax(0, 1fr));
      grid-template-rows: var(--rows, auto);
      gap: var(--gap, 12px);
      padding: var(--pad, 20px);
      box-sizing: border-box;
      max-width: var(--max-width, 1760px);
      margin: 0 auto;
    }
    .heading {
      grid-column: 1 / -1;
      align-self: end;
      margin: 12px 0 0 2px;
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 17px;
      color: var(--text-primary);
    }
    .heading:first-child {
      margin-top: 0;
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
    this._energyRefreshTimer = window.setInterval(() => this._loadEnergyStatistics(true), 5 * 60 * 1000);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._energyRefreshTimer);
  }

  protected updated(): void {
    this._loadEnergyStatistics();
  }

  private _loadEnergyStatistics(force = false): void {
    const query = this._energyQuery();
    if (!query || !this.hass?.connected || query.ids.length === 0) return;
    const hass = this.hass;
    this._energyStatistics.load(query.key, async () => {
      const cached = !force && !query.range.isCurrent
        ? this._energyStatisticsCache.get(query.key)
        : undefined;
      if (cached) return cached;
      const result = await fetchEnergyStatistics(
        hass,
        query.ids,
        query.range.statisticPeriod,
        query.range.start,
        query.range.end,
        energyExpectedBucketStarts(query.range),
      );
      if (!query.range.isCurrent) this._energyStatisticsCache.set(query.key, result);
      return result;
    }, force);
  }

  private _energyQuery(): { key: string; ids: string[]; range: EnergyPeriodRange } | undefined {
    const view = this.view;
    if (view?.hero?.type !== "energy") return undefined;
    const range = resolveEnergyPeriod(
      this.energySelection ?? currentEnergyPeriodSelection(new Date(), this.hass?.config.time_zone),
      new Date(),
      this.hass?.config.time_zone,
    );
    const orderedIds = energyStatisticIds(view);
    return { range, ids: orderedIds, key: `${range.key}|${orderedIds.join(",")}` };
  }

  private _energyContext(
    query: ReturnType<HdViewGrid["_energyQuery"]>,
  ): EnergyPeriodContext | undefined {
    if (!query) return undefined;
    const matches = this._energyStatistics.currentKey === query.key;
    return {
      range: query.range,
      statistics: matches ? this._energyStatistics.value.statistics : {},
      metadata: matches ? this._energyStatistics.value.metadata : {},
      coverage: matches ? this._energyStatistics.value.coverage : "unavailable",
      coverageById: matches ? this._energyStatistics.value.coverageById : {},
      status: matches ? this._energyStatistics.status : "idle",
      ...(matches && this._energyStatistics.error !== undefined
        ? { error: this._energyStatistics.error }
        : {}),
    };
  }

  render() {
    const view = this.view;
    const m = gridMetricsForProfile(this.displayProfile);
    const unit = squareUnit(this._dimensions.width || 1024, m);

    // A page-level hero (the Energy house) renders full-bleed above the grid.
    const energyQuery = this._energyQuery();
    const energyContext = this._energyContext(energyQuery);
    const hero = view?.hero
      ? html`<hd-energy-hero
          .hass=${this.hass}
          .options=${view.hero}
          .energyPeriod=${energyContext}
        ></hd-energy-hero>`
      : nothing;

    if (!view || (view.widgets.length === 0 && !view.hero)) {
      return html`<div class="empty">
        <hd-icon icon="mdi:view-dashboard-outline" .size=${40}></hd-icon>
        <h3>No widgets yet</h3>
        <p>Add widgets to this view in <code>dashboard.config.ts</code>.</p>
      </div>`;
    }

    const packed = packViewGrid(
      view.widgets,
      this.displayProfile,
      view.hero ? ["energy"] : [],
    );
    const gridStyle = [
      `--cols:${packed.columns}`,
      `--rows:${packed.rows.join(" ") || "auto"}`,
      `--unit:${unit}px`,
      `--gap:${m.gap}px`,
      `--pad:${m.pad}px`,
      `--max-width:${m.maxWidth}px`,
    ].join(";");

    return html`
      ${hero}
      <div class="grid" style=${gridStyle}>
        ${repeat(
          packed.items,
          (item) => item.id,
          (item) => item.kind === "heading"
            ? html`<h2
                class="heading"
                style=${`grid-row:${item.rowStart};`}
              >${item.label}</h2>`
            : renderWidgetCell(
                item.widget,
                item.placement,
                this.hass,
                { columnStart: item.columnStart, rowStart: item.rowStart },
                energyContext,
              ),
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
