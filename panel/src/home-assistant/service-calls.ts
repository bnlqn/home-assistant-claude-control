import type { HassServiceTarget, HomeAssistant } from "../types/hass.js";
import { domainOf } from "./capabilities.js";

/**
 * Service-call payload construction is kept PURE and separate from execution so
 * it can be unit-tested exhaustively. `buildX()` returns a `ServiceCall`;
 * `execute()` sends it through the authenticated `hass` object.
 */
export interface ServiceCall {
  domain: string;
  service: string;
  data?: Record<string, unknown>;
  target?: HassServiceTarget;
}

export function execute(hass: HomeAssistant, call: ServiceCall): Promise<unknown> {
  const data = { ...(call.data ?? {}) };
  const target = call.target ?? {};
  // Prefer explicit `entity_id` in data for widest compatibility, but also pass
  // a proper target when device/area targeting is requested.
  return hass.callService(call.domain, call.service, data, target);
}

const withEntity = (entityId: string, data: Record<string, unknown> = {}): Record<string, unknown> => ({
  entity_id: entityId,
  ...data,
});

// ---- Generic on/off ------------------------------------------------------
export function buildToggle(entityId: string): ServiceCall {
  const domain = domainOf(entityId);
  // Domains that own a toggle service; otherwise use homeassistant.toggle.
  const toggleDomains = new Set(["light", "switch", "fan", "input_boolean", "media_player", "cover", "climate"]);
  const d = toggleDomains.has(domain) ? domain : "homeassistant";
  return { domain: d, service: "toggle", data: withEntity(entityId) };
}

export function buildTurnOn(entityId: string, data: Record<string, unknown> = {}): ServiceCall {
  const domain = domainOf(entityId);
  const d = ["light", "switch", "fan", "media_player", "input_boolean", "climate", "humidifier"].includes(domain)
    ? domain
    : "homeassistant";
  return { domain: d, service: "turn_on", data: withEntity(entityId, data) };
}

export function buildTurnOff(entityId: string): ServiceCall {
  const domain = domainOf(entityId);
  const d = ["light", "switch", "fan", "media_player", "input_boolean", "climate", "humidifier"].includes(domain)
    ? domain
    : "homeassistant";
  return { domain: d, service: "turn_off", data: withEntity(entityId) };
}

// ---- Light ---------------------------------------------------------------
export interface LightOptions {
  brightnessPct?: number; // 0..100
  colorTempKelvin?: number;
  rgbColor?: [number, number, number];
  hsColor?: [number, number]; // hue 0..360, saturation 0..100
  effect?: string;
  transition?: number;
}

export function buildLightTurnOn(entityId: string, opts: LightOptions = {}): ServiceCall {
  const data: Record<string, unknown> = {};
  if (opts.brightnessPct != null) data.brightness_pct = clamp(Math.round(opts.brightnessPct), 0, 100);
  if (opts.colorTempKelvin != null) data.color_temp_kelvin = Math.round(opts.colorTempKelvin);
  if (opts.rgbColor) data.rgb_color = opts.rgbColor;
  if (opts.hsColor) data.hs_color = [clamp(opts.hsColor[0], 0, 360), clamp(opts.hsColor[1], 0, 100)];
  if (opts.effect) data.effect = opts.effect;
  if (opts.transition != null) data.transition = opts.transition;
  return { domain: "light", service: "turn_on", data: withEntity(entityId, data) };
}

/** brightness_pct 0 means "off" — HA turns the light off for us. */
export function buildLightBrightness(entityId: string, brightnessPct: number): ServiceCall {
  const pct = clamp(Math.round(brightnessPct), 0, 100);
  if (pct <= 0) return buildTurnOff(entityId);
  return buildLightTurnOn(entityId, { brightnessPct: pct });
}

// ---- Climate -------------------------------------------------------------
export function buildClimateTemperature(entityId: string, temperature: number): ServiceCall {
  return { domain: "climate", service: "set_temperature", data: withEntity(entityId, { temperature }) };
}
export function buildClimateHvacMode(entityId: string, hvacMode: string): ServiceCall {
  return { domain: "climate", service: "set_hvac_mode", data: withEntity(entityId, { hvac_mode: hvacMode }) };
}
export function buildClimateFanMode(entityId: string, fanMode: string): ServiceCall {
  return { domain: "climate", service: "set_fan_mode", data: withEntity(entityId, { fan_mode: fanMode }) };
}
export function buildClimatePreset(entityId: string, presetMode: string): ServiceCall {
  return { domain: "climate", service: "set_preset_mode", data: withEntity(entityId, { preset_mode: presetMode }) };
}
export function buildClimateSwing(entityId: string, swingMode: string): ServiceCall {
  return { domain: "climate", service: "set_swing_mode", data: withEntity(entityId, { swing_mode: swingMode }) };
}

// ---- Cover ---------------------------------------------------------------
export function buildCoverOpen(entityId: string): ServiceCall {
  return { domain: "cover", service: "open_cover", data: withEntity(entityId) };
}
export function buildCoverClose(entityId: string): ServiceCall {
  return { domain: "cover", service: "close_cover", data: withEntity(entityId) };
}
export function buildCoverStop(entityId: string): ServiceCall {
  return { domain: "cover", service: "stop_cover", data: withEntity(entityId) };
}
export function buildCoverPosition(entityId: string, position: number): ServiceCall {
  return {
    domain: "cover",
    service: "set_cover_position",
    data: withEntity(entityId, { position: clamp(Math.round(position), 0, 100) }),
  };
}

// ---- Media player --------------------------------------------------------
export function buildMediaPlayPause(entityId: string): ServiceCall {
  return { domain: "media_player", service: "media_play_pause", data: withEntity(entityId) };
}
export function buildMediaNext(entityId: string): ServiceCall {
  return { domain: "media_player", service: "media_next_track", data: withEntity(entityId) };
}
export function buildMediaPrevious(entityId: string): ServiceCall {
  return { domain: "media_player", service: "media_previous_track", data: withEntity(entityId) };
}
export function buildMediaVolume(entityId: string, level: number): ServiceCall {
  return {
    domain: "media_player",
    service: "volume_set",
    data: withEntity(entityId, { volume_level: clamp(level, 0, 1) }),
  };
}
export function buildMediaMute(entityId: string, muted: boolean): ServiceCall {
  return { domain: "media_player", service: "volume_mute", data: withEntity(entityId, { is_volume_muted: muted }) };
}
export function buildMediaSelectSource(entityId: string, source: string): ServiceCall {
  return { domain: "media_player", service: "select_source", data: withEntity(entityId, { source }) };
}
export function buildMediaSelectSoundMode(entityId: string, soundMode: string): ServiceCall {
  return { domain: "media_player", service: "select_sound_mode", data: withEntity(entityId, { sound_mode: soundMode }) };
}

// ---- Vacuum --------------------------------------------------------------
export function buildVacuumStart(entityId: string): ServiceCall {
  return { domain: "vacuum", service: "start", data: withEntity(entityId) };
}
export function buildVacuumPause(entityId: string): ServiceCall {
  return { domain: "vacuum", service: "pause", data: withEntity(entityId) };
}
export function buildVacuumReturn(entityId: string): ServiceCall {
  return { domain: "vacuum", service: "return_to_base", data: withEntity(entityId) };
}
export function buildVacuumFanSpeed(entityId: string, fanSpeed: string): ServiceCall {
  return { domain: "vacuum", service: "set_fan_speed", data: withEntity(entityId, { fan_speed: fanSpeed }) };
}

// ---- Lock ----------------------------------------------------------------
export function buildLock(entityId: string): ServiceCall {
  return { domain: "lock", service: "lock", data: withEntity(entityId) };
}
export function buildUnlock(entityId: string): ServiceCall {
  return { domain: "lock", service: "unlock", data: withEntity(entityId) };
}

// ---- Scene / script ------------------------------------------------------
export function buildSceneActivate(entityId: string): ServiceCall {
  return { domain: "scene", service: "turn_on", data: withEntity(entityId) };
}
export function buildScriptRun(entityId: string): ServiceCall {
  // script.<object_id> can be run via script.turn_on for any script entity.
  return { domain: "script", service: "turn_on", data: withEntity(entityId) };
}
export function buildButtonPress(entityId: string): ServiceCall {
  return { domain: "button", service: "press", data: withEntity(entityId) };
}

// ---- Number helpers (input_number / number) ------------------------------
/** Set an `input_number` or `number` helper to an exact value. */
export function buildNumberSet(entityId: string, value: number): ServiceCall {
  const domain = domainOf(entityId) === "number" ? "number" : "input_number";
  return { domain, service: "set_value", data: withEntity(entityId, { value }) };
}

// ---- Fan -----------------------------------------------------------------
export function buildFanPercentage(entityId: string, percentage: number): ServiceCall {
  return {
    domain: "fan",
    service: "set_percentage",
    data: withEntity(entityId, { percentage: clamp(Math.round(percentage), 0, 100) }),
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
