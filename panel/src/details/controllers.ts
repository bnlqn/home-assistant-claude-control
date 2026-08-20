import { html, nothing, type TemplateResult } from "lit";
import type { HassEntity } from "../types/hass.js";
import type { WidgetConfig } from "../config/schema.js";
import { buildFlowModel } from "../widgets/powerflow.js";
import { buildSolarChargingModel } from "../widgets/solarcharging.js";
import {
  buildCoverClose,
  buildCoverOpen,
  buildCoverPosition,
  buildCoverStop,
  buildLock,
  buildMediaMute,
  buildMediaNext,
  buildMediaPlayPause,
  buildMediaPrevious,
  buildMediaSelectSource,
  buildMediaSelectSoundMode,
  buildMediaVolume,
  buildNumberSet,
  buildToggle,
  buildTurnOff,
  buildTurnOn,
  buildUnlock,
  buildVacuumFanSpeed,
  buildVacuumLocate,
  buildVacuumPause,
  buildVacuumReturn,
  buildVacuumStart,
} from "../home-assistant/service-calls.js";
import { vacuumCompanions, CONSUMABLE_LOW_HOURS } from "../home-assistant/vacuum-companions.js";
import {
  coverCaps,
  mediaCaps,
  vacuumCaps,
} from "../home-assistant/capabilities.js";
import { formatAttribute, formatState, formatNumber, relativeTime, titleCase } from "../home-assistant/state-formatting.js";
import { appIcon, isAppLauncher, splitFeaturedApps } from "../home-assistant/media-apps.js";
import { mediaProgress } from "../home-assistant/media-progress.js";
import { requestConfirm } from "../primitives/feedback.js";
import type { DetailContext } from "./detail-context.js";
import { renderClimateDetail } from "./climate-detail.js";
import { renderLightDetail } from "./light-detail.js";

// ---- Media ---------------------------------------------------------------
function mediaDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const caps = mediaCaps(s);
  const picture = s.attributes.entity_picture as string | undefined;
  const title = s.attributes.media_title as string | undefined;
  const app = s.attributes.app_name as string | undefined;
  const vol = (s.attributes.volume_level as number) ?? 0;
  const muted = (s.attributes.is_volume_muted as boolean) ?? false;
  const sources = (s.attributes.source_list as string[]) ?? [];
  const soundModes = (s.attributes.sound_mode_list as string[]) ?? [];
  const off = s.state === "off";
  // Treat the source list as an app launcher when any entry is a known app
  // (Apple TV & friends); then a tap powers the device on before launching.
  const isApps = caps.selectSource && isAppLauncher(sources);
  // Promote the primary streaming apps to big branded launchers; the rest fall
  // to the secondary chip list.
  const { featured, rest } = isApps ? splitFeaturedApps(sources) : { featured: [], rest: sources };
  const launch = async (src: string) => {
    // Launching an app should wake a sleeping Apple TV, so power on first.
    if (off) await ctx.call(buildTurnOn(ctx.entityId), "turn on");
    await ctx.call(buildMediaSelectSource(ctx.entityId, src), isApps ? "launch" : "change source of");
  };
  // Some apps (Infuse, Netflix, …) play without handing the Apple TV a title or
  // artwork. Fall back to the running app's icon + name so the surface still
  // says what's on, rather than showing a blank poster.
  const playing = !off && s.state !== "idle" && s.state !== "standby";
  const artIcon = app ? appIcon(app) : undefined;
  const progress = mediaProgress(s);

  return html`
    ${picture
      ? html`<div class="media-art" style=${`background-image:url("${picture}")`}></div>`
      : playing && (artIcon || app)
        ? html`<div class="media-art media-art-fallback">
            <hd-icon icon=${artIcon ?? "mdi:television-classic"} .size=${56}></hd-icon>
            ${app ? html`<span>${app}</span>` : nothing}
          </div>`
        : nothing}
    <div class="media-meta">
      <div class="d-value">${title ?? app ?? formatState(ctx.hass, s)}</div>
      ${app && title ? html`<div class="d-sub">${app}</div>` : nothing}
    </div>
    ${progress
      ? html`<div class="d-section media-progress">
          <div class="media-progress-bar"><span style=${`width:${progress.pct}%`}></span></div>
          <div class="media-progress-time"><span>${progress.elapsed}</span><span>${progress.total}</span></div>
        </div>`
      : nothing}
    <div class="d-section media-transport">
      ${caps.power ? html`<hd-icon-button icon="mdi:power" label=${off ? "Turn on" : "Turn off"} variant=${off ? "soft" : "filled"} @click=${() => ctx.call(buildToggle(ctx.entityId), off ? "turn on" : "turn off")}></hd-icon-button>` : nothing}
      ${caps.previous ? html`<hd-icon-button icon="mdi:skip-previous" label="Previous" variant="soft" .disabled=${off} @click=${() => ctx.call(buildMediaPrevious(ctx.entityId), "skip")}></hd-icon-button>` : nothing}
      <hd-icon-button icon=${s.state === "playing" ? "mdi:pause" : "mdi:play"} label="Play or pause" variant="filled" .disabled=${off} @click=${() => ctx.call(buildMediaPlayPause(ctx.entityId), "control")}></hd-icon-button>
      ${caps.next ? html`<hd-icon-button icon="mdi:skip-next" label="Next" variant="soft" .disabled=${off} @click=${() => ctx.call(buildMediaNext(ctx.entityId), "skip")}></hd-icon-button>` : nothing}
    </div>
    ${caps.volumeSet
      ? html`<div class="d-section">
          <span class="d-label">Volume</span>
          <div class="vol-row">
            ${caps.mute ? html`<hd-icon-button icon=${muted ? "mdi:volume-off" : "mdi:volume-high"} label="Mute" variant="soft" @click=${() => ctx.call(buildMediaMute(ctx.entityId, !muted), "mute")}></hd-icon-button>` : nothing}
            <hd-slider style="flex:1" .value=${Math.round(vol * 100)} .valueText=${`${Math.round(vol * 100)}%`} label="Volume"
              @hd-change=${(e: CustomEvent) => ctx.call(buildMediaVolume(ctx.entityId, e.detail.value / 100), "set volume of")}></hd-slider>
          </div>
        </div>`
      : nothing}
    ${caps.selectSoundMode && soundModes.length
      ? html`<div class="d-section">
          <span class="d-label">Sound mode</span>
          <div class="chips">
            ${soundModes.map(
              (m) => html`<button class="chip ${s.attributes.sound_mode === m ? "active" : ""}" @click=${() => ctx.call(buildMediaSelectSoundMode(ctx.entityId, m), "set sound mode of")}>${m}</button>`,
            )}
          </div>
        </div>`
      : nothing}
    ${featured.length
      ? html`<div class="d-section">
          <span class="d-label">Apps</span>
          <div class="media-apps big-buttons">
            ${featured.map(
              (a) => html`<button
                class="bigbtn app ${s.attributes.source === a.source ? "active" : ""}"
                @click=${() => launch(a.source)}
              >
                <hd-icon icon=${a.icon} .size=${26}></hd-icon><span>${a.label}</span>
              </button>`,
            )}
          </div>
        </div>`
      : nothing}
    ${caps.selectSource && rest.length
      ? html`<div class="d-section">
          <span class="d-label">${isApps ? (featured.length ? "More apps" : "Apps") : "Source"}</span>
          <div class="chips">
            ${rest.slice(0, 24).map((src) => {
              const active = s.attributes.source === src;
              const icon = isApps ? (appIcon(src) ?? "mdi:apps") : undefined;
              return html`<button
                class="chip ${icon ? "with-icon" : ""} ${active ? "active" : ""}"
                @click=${() => launch(src)}
              >
                ${icon ? html`<hd-icon icon=${icon} .size=${18}></hd-icon>` : nothing}<span>${src}</span>
              </button>`;
            })}
          </div>
        </div>`
      : nothing}
  `;
}

// ---- Cover ---------------------------------------------------------------
function coverDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const caps = coverCaps(s);
  const pos = (s.attributes.current_position as number) ?? (s.state === "open" ? 100 : 0);
  return html`
    ${caps.setPosition
      ? html`<div class="d-section">
          <span class="d-label">Position</span>
          <hd-slider .value=${pos} .valueText=${`${Math.round(pos)}% open`} label="Position"
            @hd-change=${(e: CustomEvent) => ctx.call(buildCoverPosition(ctx.entityId, e.detail.value), "move")}></hd-slider>
        </div>`
      : nothing}
    <div class="d-section big-buttons">
      ${caps.open ? html`<button class="bigbtn" @click=${() => ctx.call(buildCoverOpen(ctx.entityId), "open")}><hd-icon icon="mdi:arrow-up" .size=${20}></hd-icon>Open</button>` : nothing}
      ${caps.stop ? html`<button class="bigbtn" @click=${() => ctx.call(buildCoverStop(ctx.entityId), "stop")}><hd-icon icon="mdi:stop" .size=${20}></hd-icon>Stop</button>` : nothing}
      ${caps.close ? html`<button class="bigbtn" @click=${() => ctx.call(buildCoverClose(ctx.entityId), "close")}><hd-icon icon="mdi:arrow-down" .size=${20}></hd-icon>Close</button>` : nothing}
    </div>
  `;
}

// ---- Lock ----------------------------------------------------------------
function lockDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const locked = s.state === "locked";
  const doUnlock = async () => {
    const ok = await requestConfirm(ctx.host, { title: `Unlock ${s.attributes.friendly_name ?? "lock"}?`, confirmLabel: "Unlock", destructive: true, icon: "mdi:lock-open-variant" });
    if (ok) void ctx.call(buildUnlock(ctx.entityId), "unlock");
  };
  return html`
    <div class="d-section big-buttons">
      <button class="bigbtn ${locked ? "active" : ""}" @click=${() => ctx.call(buildLock(ctx.entityId), "lock")}>
        <hd-icon icon="mdi:lock" .size=${20}></hd-icon>Lock
      </button>
      <button class="bigbtn ${!locked ? "active" : ""}" @click=${doUnlock}>
        <hd-icon icon="mdi:lock-open-variant" .size=${20}></hd-icon>Unlock
      </button>
    </div>
    <div class="d-meta">Last changed ${relativeTime(s.last_changed)}</div>
  `;
}

// ---- Vacuum --------------------------------------------------------------
function vacuumDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const caps = vacuumCaps(s);
  const speeds = ((s.attributes.fan_speed_list as string[]) ?? []).filter((x) => !["off", "custom"].includes(x));
  const co = vacuumCompanions(ctx.hass, ctx.entityId);
  const battery = co.battery ?? (s.attributes.battery_level as number | undefined);
  const cleaning = s.state === "cleaning";

  const runStats: Array<[string, string]> = [];
  if (typeof co.progress === "number" && cleaning) runStats.push(["Progress", `${Math.round(co.progress)}%`]);
  if (typeof co.area === "number" && co.area > 0) runStats.push(["Area", `${formatNumber(co.area)} m²`]);
  if (typeof co.cleaningTime === "number" && co.cleaningTime > 0) runStats.push(["Time", `${Math.round(co.cleaningTime)} min`]);

  return html`
    <div class="d-section big-buttons">
      <button class="bigbtn" @click=${() => ctx.call(buildVacuumStart(ctx.entityId), "start")}><hd-icon icon="mdi:play" .size=${20}></hd-icon>Start</button>
      ${caps.pause ? html`<button class="bigbtn" @click=${() => ctx.call(buildVacuumPause(ctx.entityId), "pause")}><hd-icon icon="mdi:pause" .size=${20}></hd-icon>Pause</button>` : nothing}
      ${caps.returnHome ? html`<button class="bigbtn" @click=${() => ctx.call(buildVacuumReturn(ctx.entityId), "dock")}><hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>Dock</button>` : nothing}
      ${caps.locate ? html`<button class="bigbtn" @click=${() => ctx.call(buildVacuumLocate(ctx.entityId), "locate")}><hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>Locate</button>` : nothing}
    </div>
    ${speeds.length
      ? html`<div class="d-section">
          <span class="d-label">Suction</span>
          <hd-segmented .options=${speeds.map((v) => ({ value: v, label: titleCase(v) }))} .value=${(s.attributes.fan_speed as string) ?? ""}
            @hd-select=${(e: CustomEvent) => ctx.call(buildVacuumFanSpeed(ctx.entityId, e.detail.value), "set suction for")}></hd-segmented>
        </div>`
      : nothing}
    ${runStats.length
      ? html`<div class="d-section">
          <span class="d-label">${cleaning ? (co.room ? `Cleaning ${co.room}` : "Current clean") : "Last clean"}</span>
          <div class="d-grid">
            ${runStats.map(([k, v]) => html`<div class="d-cell"><span class="k">${k}</span><span class="v">${v}</span></div>`)}
          </div>
        </div>`
      : nothing}
    ${co.consumables.length
      ? html`<div class="d-section">
          <span class="d-label">Consumables</span>
          <div class="d-grid">
            ${co.consumables.map((c) => {
              const low = c.hoursLeft <= CONSUMABLE_LOW_HOURS;
              return html`<div class="d-cell">
                <span class="k">${c.label}</span>
                <span class="v" style=${low ? "color:var(--state-warn)" : ""}>${Math.round(c.hoursLeft)} h${low ? " · replace" : ""}</span>
              </div>`;
            })}
          </div>
        </div>`
      : nothing}
    ${battery != null ? html`<div class="d-meta">Battery ${Math.round(battery)}%${co.status ? ` · ${titleCase(co.status.replace(/_/g, " "))}` : ""}</div>` : nothing}
  `;
}

// ---- Sensor --------------------------------------------------------------
function sensorDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const num = Number(s.state);
  const isNumeric = Number.isFinite(num);
  const trend = ctx.trend;
  const summary =
    trend.length > 1
      ? `Min ${formatNumber(Math.min(...trend))}, max ${formatNumber(Math.max(...trend))}, latest ${formatNumber(trend[trend.length - 1])}`
      : "";
  return html`
    <div class="d-value big">${formatState(ctx.hass, s)}</div>
    ${isNumeric && trend.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${trend} .summary=${summary}></hd-trend></div>
          <div class="d-meta">${summary}</div>
        </div>`
      : nothing}
    ${metaRows(ctx, s)}
  `;
}

// ---- Weather -------------------------------------------------------------
function weatherDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const a = s.attributes;
  const metrics: Array<[string, string]> = [];
  if (a.temperature != null) metrics.push(["Temperature", `${formatNumber(a.temperature as number)}°`]);
  if (a.humidity != null) metrics.push(["Humidity", `${Math.round(a.humidity as number)}%`]);
  if (a.wind_speed != null) metrics.push(["Wind", `${formatNumber(a.wind_speed as number)} ${a.wind_speed_unit ?? ""}`]);
  if (a.pressure != null) metrics.push(["Pressure", `${formatNumber(a.pressure as number)} ${a.pressure_unit ?? ""}`]);
  return html`
    <div class="d-value big">${titleCase(s.state)}</div>
    <div class="d-grid">
      ${metrics.map(([k, v]) => html`<div class="d-cell"><span class="k">${k}</span><span class="v">${v}</span></div>`)}
    </div>
    ${ctx.forecast.length
      ? html`<div class="d-section">
          <span class="d-label">Forecast</span>
          ${ctx.forecast.map((f) => {
            const d = new Date(f.datetime);
            const day = Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { weekday: "long" });
            return html`<div class="fc-row">
              <span class="fc-day">${day}</span>
              <hd-icon .icon=${weatherIconName(f.condition ?? "")} .size=${20}></hd-icon>
              <span class="fc-temp">${f.temperature != null ? `${Math.round(f.temperature)}°` : ""}${f.templow != null ? ` / ${Math.round(f.templow)}°` : ""}</span>
            </div>`;
          })}
        </div>`
      : nothing}
  `;
}

// ---- Energy --------------------------------------------------------------
function energyDetail(ctx: DetailContext): TemplateResult {
  const o = ctx.config?.type === "energy" ? ctx.config.options ?? {} : {};
  const val = (id?: string) => {
    if (!id) return null;
    const st = ctx.hass.states[id];
    return st ? st : null;
  };
  const rows = Object.entries(o)
    .map(([k, id]) => ({ k, st: val(id) }))
    .filter((r) => r.st);
  return html`
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${rows.map((r) => html`<div class="d-cell"><span class="k">${titleCase(r.k)}</span><span class="v">${formatState(ctx.hass, r.st!)}</span></div>`)}
      </div>
    </div>
    ${ctx.trend.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${ctx.trend} .summary=${"24 hour grid power"}></hd-trend></div>
        </div>`
      : nothing}
  `;
}

// ---- Power flow ----------------------------------------------------------
function powerflowDetail(ctx: DetailContext): TemplateResult {
  const o = ctx.config?.type === "powerflow" ? ctx.config.options ?? {} : {};
  const model = buildFlowModel(ctx.hass, o);
  const cell = (label: string, id?: string) => {
    const s = id ? ctx.hass.states[id] : undefined;
    return s
      ? html`<div class="d-cell"><span class="k">${label}</span><span class="v">${formatState(ctx.hass, s)}</span></div>`
      : nothing;
  };
  return html`
    <div class="detail-flow"><hd-flow-diagram .model=${model}></hd-flow-diagram></div>
    <div class="d-section">
      <span class="d-label">Live values</span>
      <div class="d-grid">
        ${cell("Grid", o.gridPower)} ${cell("Solar", o.solarPower)} ${cell("House", o.houseConsumption)}
        ${cell("Car charger", o.carPower)}
      </div>
    </div>
    ${ctx.trend.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Grid power — last 24 hours</span>
          <div class="detail-trend"><hd-trend .points=${ctx.trend} .summary=${"24 hour grid power"}></hd-trend></div>
        </div>`
      : nothing}
  `;
}

// ---- Solar charging ------------------------------------------------------
function solarChargingDetail(ctx: DetailContext): TemplateResult {
  const o = ctx.config?.type === "solarcharging" ? ctx.config.options ?? {} : {};
  const m = buildSolarChargingModel(ctx.hass, o);
  const toneVar =
    m.tone === "eco" ? "var(--state-eco)" : m.tone === "accent" ? "var(--accent)" : "var(--text-secondary)";

  const cell = (label: string, value: string | null) =>
    value != null ? html`<div class="d-cell"><span class="k">${label}</span><span class="v">${value}</span></div>` : nothing;

  // A grid-power threshold slider that reads its own range from the helper.
  const threshold = (
    id: string | undefined,
    label: string,
    fmt: (v: number) => string,
    fallback: { min: number; max: number; step: number },
  ) => {
    const s = id ? ctx.hass.states[id] : undefined;
    if (!id || !s) return nothing;
    const v = Number(s.state);
    const min = (s.attributes.min as number) ?? fallback.min;
    const max = (s.attributes.max as number) ?? fallback.max;
    const step = (s.attributes.step as number) ?? fallback.step;
    return html`<div class="d-section">
      <span class="d-label">${label}</span>
      <hd-slider
        .value=${Number.isFinite(v) ? v : min}
        .min=${min}
        .max=${max}
        .step=${step}
        .valueText=${Number.isFinite(v) ? fmt(v) : "—"}
        label=${label}
        @hd-change=${(e: CustomEvent) => ctx.call(buildNumberSet(id, e.detail.value), `set ${label.toLowerCase()}`)}
      ></hd-slider>
    </div>`;
  };

  return html`
    <div class="d-section d-row-between">
      <span class="d-label">Solar charging</span>
      <hd-toggle
        .checked=${m.armed}
        label="Toggle solar charging"
        @hd-toggle=${() => (o.master ? ctx.call(buildToggle(o.master), "toggle solar charging") : undefined)}
      ></hd-toggle>
    </div>

    <div class="d-section">
      <span class="d-label">Status</span>
      <div class="d-value big" style=${`color:${toneVar}`}>${m.label}</div>
      <div class="d-grid">
        ${cell("Battery", m.batteryPct != null ? `${Math.round(m.batteryPct)}%` : null)}
        ${cell("Target", m.limitPct != null ? `${Math.round(m.limitPct)}%` : null)}
        ${cell("Power", m.powerKw != null ? `${formatNumber(m.powerKw)} kW` : null)}
        ${cell("Current", m.currentA != null ? `${Math.round(m.currentA)} A` : null)}
        ${cell("Rate", m.rateKmh != null ? `${Math.round(m.rateKmh)} km/h` : null)}
        ${cell("Session", m.sessionKwh != null ? `${formatNumber(m.sessionKwh)} kWh` : null)}
      </div>
    </div>

    ${threshold(o.startThreshold, "Start above export", (v) => `${Math.abs(Math.round(v))} W export`, { min: -5000, max: -500, step: 50 })}
    ${threshold(o.stopThreshold, "Stop above import", (v) => `${Math.round(v)} W import`, { min: 0, max: 2000, step: 50 })}
    ${threshold(o.minCurrent, "Min charge current", (v) => `${Math.round(v)} A`, { min: 5, max: 10, step: 1 })}
    ${threshold(o.deadband, "Current deadband", (v) => `${Math.round(v)} A`, { min: 1, max: 5, step: 1 })}
  `;
}

// ---- Generic -------------------------------------------------------------
function genericDetail(ctx: DetailContext, s: HassEntity): TemplateResult {
  const domain = ctx.entityId.split(".")[0];
  const toggleable = ["switch", "input_boolean", "fan", "light", "humidifier", "siren"].includes(domain);
  return html`
    <div class="d-value big">${formatState(ctx.hass, s)}</div>
    ${toggleable
      ? html`<div class="d-section big-buttons">
          <button class="bigbtn" @click=${() => ctx.call(buildTurnOn(ctx.entityId), "turn on")}>Turn on</button>
          <button class="bigbtn" @click=${() => ctx.call(buildTurnOff(ctx.entityId), "turn off")}>Turn off</button>
        </div>`
      : nothing}
    ${metaRows(ctx, s)}
  `;
}

function metaRows(ctx: DetailContext, s: HassEntity): TemplateResult {
  const keys = ["device_class", "state_class", "unit_of_measurement"].filter((k) => s.attributes[k] != null);
  return html`<div class="d-grid">
    ${keys.map(
      (k) => html`<div class="d-cell"><span class="k">${titleCase(k)}</span><span class="v">${formatAttribute(ctx.hass, s, k)}</span></div>`,
    )}
    <div class="d-cell"><span class="k">Last updated</span><span class="v">${relativeTime(s.last_updated)}</span></div>
  </div>`;
}

// Local re-export to avoid a circular import with the icons module.
function weatherIconName(condition: string): string {
  const map: Record<string, string> = {
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
  return map[condition] ?? "mdi:weather-cloudy";
}

/** Pick the right controller for an entity/config and render it. */
export function renderDetailBody(ctx: DetailContext): TemplateResult {
  const s = ctx.hass.states[ctx.entityId];
  const type = ctx.config?.type;
  if (type === "energy") return energyDetail(ctx);
  if (type === "powerflow") return powerflowDetail(ctx);
  if (type === "solarcharging") return solarChargingDetail(ctx);
  if (!s) {
    return html`<div class="d-value big">Entity unavailable</div>
      <div class="d-meta">${ctx.entityId || "No entity configured"} was not found in Home Assistant.</div>`;
  }
  const domain = ctx.entityId.split(".")[0];
  switch (domain) {
    case "light":
      return renderLightDetail(ctx, s);
    case "climate":
      return renderClimateDetail(ctx, s);
    case "media_player":
      return mediaDetail(ctx, s);
    case "cover":
      return coverDetail(ctx, s);
    case "lock":
      return lockDetail(ctx, s);
    case "vacuum":
      return vacuumDetail(ctx, s);
    case "sensor":
      return sensorDetail(ctx, s);
    case "weather":
      return weatherDetail(ctx, s);
    default:
      return genericDetail(ctx, s);
  }
}

/** Domains whose detail benefits from lazily-loaded 24h history. */
export function detailNeedsHistory(entityId: string, config?: WidgetConfig): string | null {
  if (config?.type === "energy") return config.options?.gridPower ?? null;
  if (config?.type === "powerflow") return config.options?.gridPower ?? null;
  const domain = entityId.split(".")[0];
  return domain === "sensor" ? entityId : null;
}

export function detailNeedsForecast(entityId: string): boolean {
  return entityId.split(".")[0] === "weather";
}
