import { css, html, nothing, type TemplateResult } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { fetchStatistics, statisticsRange, type StatBucket } from "../home-assistant/statistics.js";
import { formatNumber } from "../home-assistant/state-formatting.js";

interface ElectricityTotalOptions {
  /** `total_increasing` grid-import energy sensor (kWh). */
  importEnergy?: string;
  /** `total_increasing` grid-export energy sensor (kWh). */
  exportEnergy?: string;
}

/**
 * Homey-style "Electricity Total" breakdown: today's `Imported − Exported =
 * Total` in kWh, sourced from the Statistics API's per-day `change` (the same
 * mechanism the energy chart uses). Entityless composite; refreshes on a light
 * interval since daily totals drift slowly.
 */
@define("hd-widget-electricitytotal")
export class ElectricityTotalWidget extends EntityWidget {
  @state() private _import = 0;
  @state() private _export = 0;
  @state() private _ready = false;
  private _timer = 0;

  private get _opts(): ElectricityTotalOptions {
    return (this.config.options ?? {}) as ElectricityTotalOptions;
  }

  // Periodic history, not live state — never re-render on meter ticks.
  protected override relevantEntityIds(): string[] {
    return [];
  }
  protected override hasDetail(): boolean {
    return false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    // Refresh today's totals every 5 min; the always-on panel stays current.
    this._timer = window.setInterval(() => void this._fetch(), 5 * 60 * 1000);
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.clearInterval(this._timer);
  }

  updated(): void {
    if (!this._ready) void this._fetch();
  }

  private _sum(buckets: StatBucket[] | undefined): number {
    return (buckets ?? []).reduce((acc, b) => acc + (b.change || 0), 0);
  }

  private async _fetch(): Promise<void> {
    if (!this.hass?.connected) return;
    const imp = this._opts.importEnergy;
    const exp = this._opts.exportEnergy;
    const ids = [imp, exp].filter((v): v is string => typeof v === "string");
    if (!ids.length) return;
    try {
      const data = await fetchStatistics(this.hass, ids, "day", statisticsRange("day", 1));
      this._import = imp ? this._sum(data[imp]) : 0;
      this._export = exp ? this._sum(data[exp]) : 0;
      this._ready = true;
    } catch {
      /* keep last values */
    }
  }

  static styles = css`
    :host {
      display: block;
    }
    .title {
      margin: 0 0 12px 2px;
      font: var(--text-widget-title);
      font-weight: 700;
      font-size: 20px;
      color: var(--text-primary);
    }
    .card {
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: 20px 22px;
      display: flex;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
    }
    .lead {
      flex: none;
      display: grid;
      place-items: center;
      color: var(--accent);
      margin-right: 4px;
    }
    .term {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      min-width: 0;
    }
    .num {
      display: flex;
      align-items: baseline;
      gap: 5px;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
    .num b {
      font: 700 clamp(24px, 7vw, 34px) / 1.05 var(--font-sans);
      color: var(--n, var(--text-primary));
    }
    .num .u {
      font: var(--text-secondary-state);
      color: var(--text-tertiary);
    }
    .lbl {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .op {
      flex: none;
      font: var(--text-value);
      color: var(--text-tertiary);
      padding: 0 6px 14px;
      align-self: center;
    }
  `;

  private _term(value: number, unit: string, label: string, color: string): TemplateResult {
    return html`<div class="term">
      <span class="num" style=${`--n:${color}`}><b>${formatNumber(value)}</b><span class="u">${unit}</span></span>
      <span class="lbl">${label}</span>
    </div>`;
  }

  renderContent(): TemplateResult {
    const total = this._import - this._export;
    const dim = !this._ready;
    return html`
      <h2 class="title">${this.config.name ?? "Electricity Total"}</h2>
      <div class="card" style=${dim ? "opacity:0.6" : ""}>
        <span class="lead"><hd-icon icon="mdi:flash" .size=${26}></hd-icon></span>
        ${this._term(this._import, "kWh", "Imported", "var(--accent)")}
        <span class="op">−</span>
        ${this._term(this._export, "kWh", "Exported", "var(--state-eco)")}
        <span class="op">=</span>
        ${this._term(total, "kWh", "Total", "var(--accent)")}
        ${nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-electricitytotal": ElectricityTotalWidget;
  }
}
