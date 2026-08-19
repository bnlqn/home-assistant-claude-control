import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { weatherIcon } from "../home-assistant/entity-adapters/icons.js";
import { titleCase, formatNumber } from "../home-assistant/state-formatting.js";
import "./widget-frame.js";
import "../primitives/entity-icon.js";

interface ForecastEntry {
  datetime: string;
  condition?: string;
  temperature?: number;
  templow?: number;
}

/**
 * Weather widget. Current conditions on 2×1; adds a multi-day forecast strip on
 * 1×2 / 2×2. Forecast is fetched lazily via `weather.get_forecasts` (modern
 * cores) with a fallback to the legacy `forecast` attribute.
 */
@define("hd-widget-weather")
export class WeatherWidget extends EntityWidget {
  @state() private _forecast: ForecastEntry[] = [];
  private _fetchedFor = "";

  protected override hasDetail(): boolean {
    return true;
  }

  static styles = css`
    .temp {
      font: var(--text-value-lg);
      font-variant-numeric: tabular-nums;
      color: var(--text-primary);
    }
    .metrics {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 2px;
    }
    .metric {
      font: var(--text-meta);
      color: var(--text-tertiary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .forecast {
      display: flex;
      justify-content: space-between;
      gap: 6px;
      margin-top: 6px;
    }
    .day {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex: 1;
    }
    .day .dow {
      font: var(--text-meta);
      color: var(--text-tertiary);
    }
    .day .hi {
      font: var(--text-secondary-state);
      font-weight: 650;
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
    }
    .day .lo {
      font: var(--text-meta);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }
  `;

  updated() {
    const big = this.currentSize === "1x2" || this.currentSize === "2x2";
    if (big && this.entityId && this.hass?.connected && this._fetchedFor !== this.entityId) {
      this._fetchedFor = this.entityId;
      void this._loadForecast();
    }
  }

  private async _loadForecast() {
    const vm = this.vm;
    // Legacy attribute fallback first (dev harness / old cores).
    const attrForecast = vm.stateObj?.attributes.forecast as ForecastEntry[] | undefined;
    if (attrForecast?.length) {
      this._forecast = attrForecast.slice(0, 5);
      return;
    }
    if (!this.hass || !this.entityId) return;
    try {
      const res = await this.hass.callWS<{ response: Record<string, { forecast: ForecastEntry[] }> }>({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "daily" },
        target: { entity_id: this.entityId },
        return_response: true,
      });
      const list = res?.response?.[this.entityId]?.forecast ?? [];
      this._forecast = list.slice(0, 5);
    } catch {
      this._forecast = [];
    }
  }

  private _metrics() {
    const a = this.vm.stateObj?.attributes ?? {};
    const items: Array<[string, string]> = [];
    if (a.humidity != null) items.push(["mdi:water-percent", `${Math.round(a.humidity as number)}%`]);
    if (a.wind_speed != null)
      items.push(["mdi:weather-windy", `${formatNumber(a.wind_speed as number)} ${a.wind_speed_unit ?? "km/h"}`]);
    return html`<div class="metrics">
      ${items.map(
        ([i, t]) => html`<span class="metric"><hd-icon .icon=${i} .size=${14}></hd-icon>${t}</span>`,
      )}
    </div>`;
  }

  private _forecastStrip() {
    if (!this._forecast.length) return nothing;
    return html`<div class="forecast">
      ${this._forecast.map((f) => {
        const d = new Date(f.datetime);
        const dow = Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { weekday: "short" });
        return html`<div class="day">
          <span class="dow">${dow}</span>
          <hd-icon .icon=${weatherIcon(f.condition ?? "")} .size=${20}></hd-icon>
          <span class="hi">${f.temperature != null ? `${Math.round(f.temperature)}°` : "–"}</span>
          ${f.templow != null ? html`<span class="lo">${Math.round(f.templow)}°</span>` : nothing}
        </div>`;
      })}
    </div>`;
  }

  renderContent() {
    const vm = this.vm;
    const a = vm.stateObj?.attributes ?? {};
    const size = this.currentSize;
    const big = size === "1x2" || size === "2x2";

    return html`
      <hd-widget-frame
        .icon=${weatherIcon(vm.rawState)}
        .name=${vm.name}
        .stateText=${titleCase(vm.rawState)}
        .size=${size}
        .accent=${"accent"}
        .active=${false}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="temp">${a.temperature != null ? `${formatNumber(a.temperature as number)}°` : "—"}</div>
        ${this._metrics()} ${big ? this._forecastStrip() : nothing}
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-weather": WeatherWidget;
  }
}
