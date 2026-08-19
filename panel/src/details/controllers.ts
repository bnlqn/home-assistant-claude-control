import { html, nothing, type TemplateResult } from "lit";
import type { HomeAssistant, HassEntity } from "../types/hass.js";
import type { WidgetConfig } from "../config/schema.js";
import type { ServiceCall } from "../home-assistant/service-calls.js";
import { buildFlowModel, type PowerflowOptions } from "../widgets/powerflow.js";
import { buildSolarChargingModel, type SolarChargingOptions } from "../widgets/solarcharging.js";
import {
  buildClimateFanMode,
  buildClimateHvacMode,
  buildClimatePreset,
  buildClimateSwing,
  buildClimateTemperature,
  buildCoverClose,
  buildCoverOpen,
  buildCoverPosition,
  buildCoverStop,
  buildLightBrightness,
  buildLightTurnOn,
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
  buildVacuumPause,
  buildVacuumReturn,
  buildVacuumStart,
} from "../home-assistant/service-calls.js";
import {
  climateCaps,
  coverCaps,
  lightCaps,
  mediaCaps,
  vacuumCaps,
} from "../home-assistant/capabilities.js";
import { formatAttribute, formatState, formatNumber, formatDuration, relativeTime, titleCase } from "../home-assistant/state-formatting.js";
import { appIcon, isAppLauncher } from "../home-assistant/media-apps.js";
import type { SegmentOption } from "../primitives/segmented.js";
import { requestConfirm } from "../primitives/feedback.js";

export interface DetailCtx {
  hass: HomeAssistant;
  entityId: string;
  config?: WidgetConfig;
  host: HTMLElement;
  trend: number[];
  forecast: Array<{ datetime: string; condition?: string; temperature?: number; templow?: number }>;
  /** Execute a service call (with error feedback handled by the surface). */
  call: (c: ServiceCall, verb?: string) => Promise<void>;
}

const COLOR_SWATCHES: Array<[string, [number, number, number]]> = [
  ["Warm white", [255, 197, 143]],
  ["Sun", [255, 233, 170]],
  ["Red", [255, 74, 74]],
  ["Orange", [255, 145, 48]],
  ["Green", [86, 200, 90]],
  ["Teal", [40, 200, 180]],
  ["Blue", [70, 130, 255]],
  ["Indigo", [120, 90, 240]],
  ["Pink", [255, 92, 170]],
];

/** RGB (0..255) → [hue 0..360, saturation 0..100], for seeding the colour wheel. */
function rgbToHs(rgb: [number, number, number]): [number, number] {
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  const sat = max === 0 ? 0 : (d / max) * 100;
  return [Math.round(h), Math.round(sat)];
}

// ---- Light ---------------------------------------------------------------
function lightDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
  const caps = lightCaps(s);
  const on = s.state === "on";
  const brightness = on ? Math.round(((s.attributes.brightness as number) ?? 255) / 2.55) : 0;
  const min = (s.attributes.min_color_temp_kelvin as number) ?? 2200;
  const max = (s.attributes.max_color_temp_kelvin as number) ?? 6500;
  const curTemp = (s.attributes.color_temp_kelvin as number) ?? Math.round((min + max) / 2);
  const effects = (s.attributes.effect_list as string[] | undefined)?.filter((e) => e && e !== "None") ?? [];
  const hs = s.attributes.hs_color as [number, number] | undefined;
  const rgbCur = s.attributes.rgb_color as [number, number, number] | undefined;
  const [wheelHue, wheelSat] = hs ? [hs[0], hs[1]] : rgbCur ? rgbToHs(rgbCur) : [0, 0];

  return html`
    <div class="d-section d-row-between">
      <span class="d-label">Power</span>
      <hd-toggle
        .checked=${on}
        label="Toggle light"
        @hd-toggle=${() => ctx.call(buildToggle(ctx.entityId), "toggle")}
      ></hd-toggle>
    </div>

    ${caps.brightness
      ? html`<div class="d-section">
          <span class="d-label">Brightness</span>
          <hd-slider
            .value=${brightness}
            .min=${1}
            .max=${100}
            .disabled=${!on}
            .valueText=${on ? `${brightness}%` : "Off"}
            .color=${"var(--state-light)"}
            icon="mdi:brightness-6"
            label="Brightness"
            @hd-change=${(e: CustomEvent) => ctx.call(buildLightBrightness(ctx.entityId, e.detail.value), "dim")}
          ></hd-slider>
        </div>`
      : nothing}

    ${caps.colorTemp
      ? html`<div class="d-section">
          <span class="d-label">Color temperature</span>
          <hd-slider
            .value=${curTemp}
            .min=${min}
            .max=${max}
            .step=${50}
            .disabled=${!on}
            .color=${"linear-gradient(90deg,#ffb85c,#fff5e8,#cfe0ff)"}
            label="Color temperature"
            @hd-change=${(e: CustomEvent) => ctx.call(buildLightTurnOn(ctx.entityId, { colorTempKelvin: e.detail.value }), "set color of")}
          ></hd-slider>
        </div>`
      : nothing}

    ${caps.color
      ? html`<div class="d-section">
          <span class="d-label">Color</span>
          <div class="color-wheel-wrap">
            <hd-color-wheel
              .hue=${wheelHue}
              .sat=${wheelSat}
              .disabled=${!on}
              @hd-color=${(e: CustomEvent) =>
                ctx.call(buildLightTurnOn(ctx.entityId, { hsColor: [e.detail.hue, e.detail.sat] }), "set color of")}
            ></hd-color-wheel>
          </div>
          <div class="swatches">
            ${COLOR_SWATCHES.map(
              ([name, rgb]) => html`<button
                class="swatch"
                style=${`background:rgb(${rgb[0]},${rgb[1]},${rgb[2]})`}
                aria-label=${name}
                ?disabled=${!on}
                @click=${() => ctx.call(buildLightTurnOn(ctx.entityId, { rgbColor: rgb }), "set color of")}
              ></button>`,
            )}
          </div>
        </div>`
      : nothing}

    ${caps.effects && effects.length
      ? html`<div class="d-section">
          <span class="d-label">Effect</span>
          <div class="chips">
            ${effects.slice(0, 12).map(
              (fx) => html`<button
                class="chip ${s.attributes.effect === fx ? "active" : ""}"
                ?disabled=${!on}
                @click=${() => ctx.call(buildLightTurnOn(ctx.entityId, { effect: fx }), "set effect of")}
              >
                ${titleCase(fx)}
              </button>`,
            )}
          </div>
        </div>`
      : nothing}
  `;
}

// ---- Climate -------------------------------------------------------------
function climateDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
  const caps = climateCaps(s);
  const off = s.state === "off";
  const target = (s.attributes.temperature as number) ?? 20;
  const cur = s.attributes.current_temperature as number | undefined;
  const stepSize = (s.attributes.target_temp_step as number) ?? 0.5;
  const modes = (s.attributes.hvac_modes as string[]) ?? [];
  const fanModes = (s.attributes.fan_modes as string[]) ?? [];
  const swingModes = (s.attributes.swing_modes as string[]) ?? [];
  const presets = (s.attributes.preset_modes as string[]) ?? [];
  // Extra device switches surfaced from config (e.g. the Airco's powerful /
  // economy / quiet-fan / human-detection toggles), each a real switch entity.
  const controls = ((ctx.config?.options?.switches as Array<{ entity: string; name: string }>) ?? []).filter(
    (c) => ctx.hass.states[c.entity],
  );

  const step = (d: number) => {
    const minT = (s.attributes.min_temp as number) ?? 7;
    const maxT = (s.attributes.max_temp as number) ?? 35;
    const next = Math.min(maxT, Math.max(minT, target + d * stepSize));
    void ctx.call(buildClimateTemperature(ctx.entityId, Number(next.toFixed(1))), "set temperature for");
  };
  const seg = (values: string[]): SegmentOption[] => values.map((v) => ({ value: v, label: titleCase(v) }));

  return html`
    ${caps.targetTemp
      ? html`<div class="d-section climate-hero">
          <hd-icon-button icon="mdi:minus" label="Lower" variant="soft" .disabled=${off} @click=${() => step(-1)}></hd-icon-button>
          <div class="climate-target">
            <span class="big">${off ? "—" : `${formatNumber(target)}°`}</span>
            ${cur != null ? html`<span class="sub">Now ${formatNumber(cur)}°</span>` : nothing}
          </div>
          <hd-icon-button icon="mdi:plus" label="Raise" variant="soft" .disabled=${off} @click=${() => step(1)}></hd-icon-button>
        </div>`
      : nothing}

    ${modes.length > 1
      ? html`<div class="d-section">
          <span class="d-label">Mode</span>
          <hd-segmented .options=${seg(modes)} .value=${s.state} label="Mode"
            @hd-select=${(e: CustomEvent) => ctx.call(buildClimateHvacMode(ctx.entityId, e.detail.value), "set mode for")}></hd-segmented>
        </div>`
      : nothing}
    ${caps.fanMode && fanModes.length
      ? html`<div class="d-section">
          <span class="d-label">Fan</span>
          <hd-segmented .options=${seg(fanModes)} .value=${(s.attributes.fan_mode as string) ?? ""} label="Fan mode"
            @hd-select=${(e: CustomEvent) => ctx.call(buildClimateFanMode(ctx.entityId, e.detail.value), "set fan for")}></hd-segmented>
        </div>`
      : nothing}
    ${caps.swingMode && swingModes.length
      ? html`<div class="d-section">
          <span class="d-label">Swing</span>
          <hd-segmented .options=${seg(swingModes)} .value=${(s.attributes.swing_mode as string) ?? ""} label="Swing mode"
            @hd-select=${(e: CustomEvent) => ctx.call(buildClimateSwing(ctx.entityId, e.detail.value), "set swing for")}></hd-segmented>
        </div>`
      : nothing}
    ${caps.presetMode && presets.length
      ? html`<div class="d-section">
          <span class="d-label">Preset</span>
          <hd-segmented .options=${seg(presets)} .value=${(s.attributes.preset_mode as string) ?? ""} label="Preset"
            @hd-select=${(e: CustomEvent) => ctx.call(buildClimatePreset(ctx.entityId, e.detail.value), "set preset for")}></hd-segmented>
        </div>`
      : nothing}

    ${controls.map((c) => {
      const on = ctx.hass.states[c.entity]!.state === "on";
      return html`<div class="d-section d-row-between">
        <span class="d-label">${c.name}</span>
        <hd-toggle
          .checked=${on}
          label=${c.name}
          @hd-toggle=${() => ctx.call(buildToggle(c.entity), `toggle ${c.name.toLowerCase()}`)}
        ></hd-toggle>
      </div>`;
    })}
  `;
}

// ---- Media ---------------------------------------------------------------
/**
 * Playback progress from media_position/duration, advancing the reported
 * position by the time elapsed since it was last updated (as HA's own media
 * card does). Returns null when the player exposes no usable duration.
 */
function mediaProgress(s: HassEntity): { pct: number; elapsed: string; total: string } | null {
  const duration = s.attributes.media_duration as number | undefined;
  if (!duration || duration <= 0) return null;
  let position = (s.attributes.media_position as number) ?? 0;
  const updated = s.attributes.media_position_updated_at as string | undefined;
  if (s.state === "playing" && updated) {
    position += (Date.now() - new Date(updated).getTime()) / 1000;
  }
  position = Math.max(0, Math.min(position, duration));
  return {
    pct: (position / duration) * 100,
    elapsed: formatDuration(position),
    total: formatDuration(duration),
  };
}

function mediaDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
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
    ${caps.selectSource && sources.length
      ? html`<div class="d-section">
          <span class="d-label">${isApps ? "Apps" : "Source"}</span>
          <div class="chips">
            ${sources.slice(0, 24).map((src) => {
              const active = s.attributes.source === src;
              const icon = isApps ? (appIcon(src) ?? "mdi:apps") : undefined;
              return html`<button
                class="chip ${icon ? "with-icon" : ""} ${active ? "active" : ""}"
                @click=${async () => {
                  // Launching an app should wake a sleeping Apple TV, so power
                  // on first, then select the source.
                  if (off) await ctx.call(buildTurnOn(ctx.entityId), "turn on");
                  await ctx.call(buildMediaSelectSource(ctx.entityId, src), isApps ? "launch" : "change source of");
                }}
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
function coverDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
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
function lockDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
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
function vacuumDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
  const caps = vacuumCaps(s);
  const speeds = ((s.attributes.fan_speed_list as string[]) ?? []).filter((x) => !["off", "custom"].includes(x));
  const battery = s.attributes.battery_level as number | undefined;
  return html`
    <div class="d-section big-buttons">
      <button class="bigbtn" @click=${() => ctx.call(buildVacuumStart(ctx.entityId), "start")}><hd-icon icon="mdi:play" .size=${20}></hd-icon>Start</button>
      ${caps.pause ? html`<button class="bigbtn" @click=${() => ctx.call(buildVacuumPause(ctx.entityId), "pause")}><hd-icon icon="mdi:pause" .size=${20}></hd-icon>Pause</button>` : nothing}
      ${caps.returnHome ? html`<button class="bigbtn" @click=${() => ctx.call(buildVacuumReturn(ctx.entityId), "dock")}><hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>Dock</button>` : nothing}
    </div>
    ${speeds.length
      ? html`<div class="d-section">
          <span class="d-label">Suction</span>
          <hd-segmented .options=${speeds.map((v) => ({ value: v, label: titleCase(v) }))} .value=${(s.attributes.fan_speed as string) ?? ""}
            @hd-select=${(e: CustomEvent) => ctx.call(buildVacuumFanSpeed(ctx.entityId, e.detail.value), "set suction for")}></hd-segmented>
        </div>`
      : nothing}
    ${battery != null ? html`<div class="d-meta">Battery ${Math.round(battery)}%</div>` : nothing}
  `;
}

// ---- Sensor --------------------------------------------------------------
function sensorDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
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
function weatherDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
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
function energyDetail(ctx: DetailCtx): TemplateResult {
  const o = (ctx.config?.options ?? {}) as Record<string, string>;
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
function powerflowDetail(ctx: DetailCtx): TemplateResult {
  const o = (ctx.config?.options ?? {}) as PowerflowOptions;
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
function solarChargingDetail(ctx: DetailCtx): TemplateResult {
  const o = (ctx.config?.options ?? {}) as SolarChargingOptions;
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
function genericDetail(ctx: DetailCtx, s: HassEntity): TemplateResult {
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

function metaRows(ctx: DetailCtx, s: HassEntity): TemplateResult {
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
export function renderDetailBody(ctx: DetailCtx): TemplateResult {
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
      return lightDetail(ctx, s);
    case "climate":
      return climateDetail(ctx, s);
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
  if (config?.type === "energy" || config?.type === "powerflow") {
    return (config.options as Record<string, string>)?.gridPower ?? null;
  }
  const domain = entityId.split(".")[0];
  return domain === "sensor" ? entityId : null;
}

export function detailNeedsForecast(entityId: string): boolean {
  return entityId.split(".")[0] === "weather";
}
