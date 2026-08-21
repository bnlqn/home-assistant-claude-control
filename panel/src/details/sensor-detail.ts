import { html, nothing, type TemplateResult } from "lit";
import {
  formatNumber,
  formatState,
  titleCase,
} from "../home-assistant/state-formatting.js";
import type { HassEntity } from "../types/hass.js";
import type { DetailContext } from "./detail-context.js";
import { renderDetailMeta } from "./detail-meta.js";

export function renderSensorDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const numeric = Number.isFinite(Number(state.state));
  const trend = ctx.trend;
  const summary = trend.length > 1
    ? `Min ${formatNumber(Math.min(...trend))}, max ${formatNumber(Math.max(...trend))}, latest ${formatNumber(trend[trend.length - 1])}`
    : "";
  return html`
    <div class="d-value big">${formatState(ctx.hass, state)}</div>
    ${numeric && trend.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Last 24 hours</span>
          <div class="detail-trend">
            <hd-trend
              detailed
              .points=${trend}
              .times=${ctx.trendPoints.map((p) => p.t)}
              .unit=${ctx.trendUnit}
              .summary=${summary}
            ></hd-trend>
          </div>
          <div class="d-meta">${summary}</div>
        </div>`
      : nothing}
    ${renderDetailMeta(ctx, state)}
  `;
}

export function renderWeatherDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const attributes = state.attributes;
  const metrics: Array<[string, string]> = [];
  if (attributes.temperature != null) {
    metrics.push(["Temperature", `${formatNumber(attributes.temperature as number)}°`]);
  }
  if (attributes.humidity != null) {
    metrics.push(["Humidity", `${Math.round(attributes.humidity as number)}%`]);
  }
  if (attributes.wind_speed != null) {
    metrics.push([
      "Wind",
      `${formatNumber(attributes.wind_speed as number)} ${attributes.wind_speed_unit ?? ""}`,
    ]);
  }
  if (attributes.pressure != null) {
    metrics.push([
      "Pressure",
      `${formatNumber(attributes.pressure as number)} ${attributes.pressure_unit ?? ""}`,
    ]);
  }
  return html`
    <div class="d-value big">${titleCase(state.state)}</div>
    <div class="d-grid">
      ${metrics.map(([key, value]) => html`<div class="d-cell">
        <span class="k">${key}</span><span class="v">${value}</span>
      </div>`)}
    </div>
    ${ctx.forecast.length
      ? html`<div class="d-section">
          <span class="d-label">Forecast</span>
          ${ctx.forecast.map((forecast) => {
            const date = new Date(forecast.datetime);
            const day = Number.isNaN(date.getTime())
              ? ""
              : date.toLocaleDateString(undefined, { weekday: "long" });
            return html`<div class="fc-row">
              <span class="fc-day">${day}</span>
              <hd-icon
                .icon=${weatherIconName(forecast.condition ?? "")}
                .size=${20}
              ></hd-icon>
              <span class="fc-temp">${forecast.temperature != null
                ? `${Math.round(forecast.temperature)}°`
                : ""}${forecast.templow != null
                ? ` / ${Math.round(forecast.templow)}°`
                : ""}</span>
            </div>`;
          })}
        </div>`
      : nothing}
  `;
}

function weatherIconName(condition: string): string {
  const icons: Record<string, string> = {
    sunny: "mdi:weather-sunny",
    "clear-night": "mdi:weather-night",
    cloudy: "mdi:weather-cloudy",
    partlycloudy: "mdi:weather-partly-cloudy",
    rainy: "mdi:weather-rainy",
    pouring: "mdi:weather-pouring",
    snowy: "mdi:weather-snowy",
    fog: "mdi:weather-fog",
    windy: "mdi:weather-windy",
  };
  return icons[condition] ?? "mdi:weather-cloudy";
}
