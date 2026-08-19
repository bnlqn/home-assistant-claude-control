import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { fetchNumericHistory } from "../home-assistant/history.js";
import { formatNumber } from "../home-assistant/state-formatting.js";
import "./widget-frame.js";
import "../primitives/misc.js";

interface EnergyOptions {
  gridPower?: string;
  solarPower?: string;
  solarToday?: string;
  forecastEndOfDay?: string;
  solarForecastRemaining?: string;
}

/**
 * Composite energy widget (entityless — reads sensors from `options`). Shows
 * live grid power as the hero (import vs. export colored), key stats, and a
 * lazy 24 h power trend at 2×2.
 */
@define("hd-widget-energy")
export class EnergyWidget extends EntityWidget {
  @state() private _trend: number[] = [];
  private _fetchedFor = "";

  protected override hasDetail(): boolean {
    return true;
  }

  private get _opts(): EnergyOptions {
    return (this.config.options ?? {}) as EnergyOptions;
  }

  protected override relevantEntityIds(): string[] {
    return Object.values(this._opts).filter((v): v is string => typeof v === "string");
  }

  static styles = css`
    .hero {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .hero .num {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--flow-color, var(--text-primary));
    }
    .hero .unit {
      font: var(--text-widget-title);
      color: var(--text-secondary);
    }
    .flow-label {
      font: var(--text-meta);
      color: var(--text-tertiary);
      margin-top: -2px;
    }
    .stats {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .trend {
      height: 44px;
      margin-top: 8px;
    }
  `;

  updated() {
    const gp = this._opts.gridPower;
    if (this.currentSize === "2x2" && gp && this.hass?.connected && this._fetchedFor !== gp) {
      this._fetchedFor = gp;
      void this._loadTrend(gp);
    }
  }

  private async _loadTrend(entityId: string) {
    if (!this.hass) return;
    const pts = await fetchNumericHistory(this.hass, entityId, 24);
    this._trend = pts.map((p) => p.value);
  }

  private _num(entityId?: string): number | null {
    if (!entityId || !this.hass) return null;
    const s = this.hass.states[entityId];
    if (!s) return null;
    const n = Number(s.state);
    return Number.isFinite(n) ? n : null;
  }

  private _powerText(watts: number): { value: string; unit: string } {
    const abs = Math.abs(watts);
    if (abs >= 1000) return { value: formatNumber(abs / 1000), unit: "kW" };
    return { value: String(Math.round(abs)), unit: "W" };
  }

  renderContent() {
    const o = this._opts;
    const grid = this._num(o.gridPower);
    const solar = this._num(o.solarPower);
    const solarToday = this._num(o.solarToday);
    const forecast = this._num(o.forecastEndOfDay);
    const solarRemaining = this._num(o.solarForecastRemaining);
    const size = this.currentSize;

    const importing = (grid ?? 0) >= 0;
    const flowColor = grid == null ? "var(--text-primary)" : importing ? "var(--text-primary)" : "var(--state-eco)";
    const hero = grid == null ? { value: "—", unit: "" } : this._powerText(grid);

    return html`
      <hd-widget-frame
        .icon=${importing ? "mdi:transmission-tower-import" : "mdi:solar-power"}
        .name=${this.config.name ?? "Energy"}
        .stateText=${""}
        .size=${size}
        .accent=${importing ? "accent" : "eco"}
        .active=${false}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div>
          <div class="hero" style=${`--flow-color:${flowColor}`}>
            <span class="num">${hero.value}</span><span class="unit">${hero.unit}</span>
          </div>
          <div class="flow-label">
            ${grid == null ? "Grid power unavailable" : importing ? "Importing from grid" : "Exporting to grid"}
          </div>
        </div>

        <div class="stats">
          ${solar != null
            ? html`<hd-status-badge tone="eco" icon="mdi:solar-power-variant" text=${`${this._powerText(solar).value} ${this._powerText(solar).unit} now`}></hd-status-badge>`
            : nothing}
          ${solarToday != null
            ? html`<hd-status-badge tone="eco" icon="mdi:weather-sunny" text=${`${formatNumber(solarToday)} kWh today`}></hd-status-badge>`
            : nothing}
          ${solarRemaining != null && solar == null
            ? html`<hd-status-badge tone="neutral" icon="mdi:chart-bell-curve" text=${`${formatNumber(solarRemaining)} kWh left`}></hd-status-badge>`
            : nothing}
          ${forecast != null && (size === "2x2" || size === "2x1")
            ? html`<hd-status-badge tone="neutral" icon="mdi:chart-line" text=${`${formatNumber(forecast)} kWh forecast`}></hd-status-badge>`
            : nothing}
        </div>

        ${size === "2x2" && this._trend.length > 1
          ? html`<div class="trend">
              <hd-trend .points=${this._trend} .color=${"var(--accent)"} .summary=${"24 hour grid power"}></hd-trend>
            </div>`
          : nothing}
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-energy": EnergyWidget;
  }
}
