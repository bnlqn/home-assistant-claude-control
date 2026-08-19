import type { HassEntity } from "../types/hass.js";

/**
 * Capability detection is feature-driven, never domain-assumed. A control
 * (brightness, color, fan mode, tilt, source, …) is only offered when the
 * entity actually advertises it via `supported_features` / attributes.
 *
 * Bit values mirror Home Assistant's domain feature enums.
 */

export function hasFeature(stateObj: HassEntity | undefined, bit: number): boolean {
  if (!stateObj) return false;
  const sf = stateObj.attributes.supported_features ?? 0;
  return (sf & bit) === bit;
}

export function domainOf(entityId: string): string {
  return entityId.split(".")[0];
}

export function isUnavailable(stateObj: HassEntity | undefined): boolean {
  return !stateObj || stateObj.state === "unavailable";
}

export function isUnknown(stateObj: HassEntity | undefined): boolean {
  return !!stateObj && stateObj.state === "unknown";
}

// ---- Light ---------------------------------------------------------------
export const LIGHT_FEATURE = { EFFECT: 4, FLASH: 8, TRANSITION: 32 } as const;

const COLOR_MODES_WITH_BRIGHTNESS = new Set([
  "brightness",
  "color_temp",
  "hs",
  "xy",
  "rgb",
  "rgbw",
  "rgbww",
  "white",
]);
const COLOR_MODES_WITH_COLOR = new Set(["hs", "xy", "rgb", "rgbw", "rgbww"]);

export interface LightCaps {
  brightness: boolean;
  colorTemp: boolean;
  color: boolean;
  effects: boolean;
}

export function lightCaps(stateObj: HassEntity | undefined): LightCaps {
  const modes = (stateObj?.attributes.supported_color_modes as string[] | undefined) ?? [];
  return {
    brightness: modes.some((m) => COLOR_MODES_WITH_BRIGHTNESS.has(m)),
    colorTemp: modes.includes("color_temp"),
    color: modes.some((m) => COLOR_MODES_WITH_COLOR.has(m)),
    effects: hasFeature(stateObj, LIGHT_FEATURE.EFFECT),
  };
}

// ---- Cover ---------------------------------------------------------------
export const COVER_FEATURE = {
  OPEN: 1,
  CLOSE: 2,
  SET_POSITION: 4,
  STOP: 8,
  OPEN_TILT: 16,
  CLOSE_TILT: 32,
  STOP_TILT: 64,
  SET_TILT_POSITION: 128,
} as const;

export interface CoverCaps {
  open: boolean;
  close: boolean;
  stop: boolean;
  setPosition: boolean;
  tilt: boolean;
  setTilt: boolean;
}

export function coverCaps(stateObj: HassEntity | undefined): CoverCaps {
  return {
    open: hasFeature(stateObj, COVER_FEATURE.OPEN),
    close: hasFeature(stateObj, COVER_FEATURE.CLOSE),
    stop: hasFeature(stateObj, COVER_FEATURE.STOP),
    setPosition: hasFeature(stateObj, COVER_FEATURE.SET_POSITION),
    tilt: hasFeature(stateObj, COVER_FEATURE.OPEN_TILT) || hasFeature(stateObj, COVER_FEATURE.CLOSE_TILT),
    setTilt: hasFeature(stateObj, COVER_FEATURE.SET_TILT_POSITION),
  };
}

// ---- Climate -------------------------------------------------------------
export const CLIMATE_FEATURE = {
  TARGET_TEMPERATURE: 1,
  TARGET_TEMPERATURE_RANGE: 2,
  TARGET_HUMIDITY: 4,
  FAN_MODE: 8,
  PRESET_MODE: 16,
  SWING_MODE: 32,
  TURN_OFF: 128,
  TURN_ON: 256,
  SWING_HORIZONTAL_MODE: 512,
} as const;

export interface ClimateCaps {
  targetTemp: boolean;
  targetTempRange: boolean;
  fanMode: boolean;
  presetMode: boolean;
  swingMode: boolean;
  humidity: boolean;
}

export function climateCaps(stateObj: HassEntity | undefined): ClimateCaps {
  return {
    targetTemp: hasFeature(stateObj, CLIMATE_FEATURE.TARGET_TEMPERATURE),
    targetTempRange: hasFeature(stateObj, CLIMATE_FEATURE.TARGET_TEMPERATURE_RANGE),
    fanMode: hasFeature(stateObj, CLIMATE_FEATURE.FAN_MODE),
    presetMode: hasFeature(stateObj, CLIMATE_FEATURE.PRESET_MODE),
    swingMode: hasFeature(stateObj, CLIMATE_FEATURE.SWING_MODE),
    humidity: hasFeature(stateObj, CLIMATE_FEATURE.TARGET_HUMIDITY),
  };
}

// ---- Media player --------------------------------------------------------
export const MEDIA_FEATURE = {
  PAUSE: 1,
  SEEK: 2,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY_MEDIA: 512,
  VOLUME_STEP: 1024,
  SELECT_SOURCE: 2048,
  STOP: 4096,
  PLAY: 16384,
  SELECT_SOUND_MODE: 65536,
  BROWSE_MEDIA: 131072,
} as const;

export interface MediaCaps {
  play: boolean;
  pause: boolean;
  stop: boolean;
  next: boolean;
  previous: boolean;
  volumeSet: boolean;
  volumeStep: boolean;
  mute: boolean;
  selectSource: boolean;
  selectSoundMode: boolean;
  power: boolean;
}

export function mediaCaps(stateObj: HassEntity | undefined): MediaCaps {
  return {
    play: hasFeature(stateObj, MEDIA_FEATURE.PLAY),
    pause: hasFeature(stateObj, MEDIA_FEATURE.PAUSE),
    stop: hasFeature(stateObj, MEDIA_FEATURE.STOP),
    next: hasFeature(stateObj, MEDIA_FEATURE.NEXT_TRACK),
    previous: hasFeature(stateObj, MEDIA_FEATURE.PREVIOUS_TRACK),
    volumeSet: hasFeature(stateObj, MEDIA_FEATURE.VOLUME_SET),
    volumeStep: hasFeature(stateObj, MEDIA_FEATURE.VOLUME_STEP),
    mute: hasFeature(stateObj, MEDIA_FEATURE.VOLUME_MUTE),
    selectSource: hasFeature(stateObj, MEDIA_FEATURE.SELECT_SOURCE),
    selectSoundMode: hasFeature(stateObj, MEDIA_FEATURE.SELECT_SOUND_MODE),
    power: hasFeature(stateObj, MEDIA_FEATURE.TURN_ON) || hasFeature(stateObj, MEDIA_FEATURE.TURN_OFF),
  };
}

// ---- Vacuum --------------------------------------------------------------
export const VACUUM_FEATURE = {
  PAUSE: 4,
  STOP: 8,
  RETURN_HOME: 16,
  FAN_SPEED: 32,
  BATTERY: 64,
  LOCATE: 512,
  CLEAN_SPOT: 1024,
  START: 8192,
} as const;

export interface VacuumCaps {
  start: boolean;
  pause: boolean;
  stop: boolean;
  returnHome: boolean;
  fanSpeed: boolean;
  battery: boolean;
  locate: boolean;
}

export function vacuumCaps(stateObj: HassEntity | undefined): VacuumCaps {
  return {
    start: hasFeature(stateObj, VACUUM_FEATURE.START),
    pause: hasFeature(stateObj, VACUUM_FEATURE.PAUSE),
    stop: hasFeature(stateObj, VACUUM_FEATURE.STOP),
    returnHome: hasFeature(stateObj, VACUUM_FEATURE.RETURN_HOME),
    fanSpeed: hasFeature(stateObj, VACUUM_FEATURE.FAN_SPEED),
    battery: hasFeature(stateObj, VACUUM_FEATURE.BATTERY),
    locate: hasFeature(stateObj, VACUUM_FEATURE.LOCATE),
  };
}

// ---- Fan -----------------------------------------------------------------
export const FAN_FEATURE = { SET_SPEED: 1, OSCILLATE: 2, DIRECTION: 4, PRESET_MODE: 8 } as const;

export interface FanCaps {
  speed: boolean;
  oscillate: boolean;
  direction: boolean;
  presetMode: boolean;
}

export function fanCaps(stateObj: HassEntity | undefined): FanCaps {
  return {
    speed: hasFeature(stateObj, FAN_FEATURE.SET_SPEED),
    oscillate: hasFeature(stateObj, FAN_FEATURE.OSCILLATE),
    direction: hasFeature(stateObj, FAN_FEATURE.DIRECTION),
    presetMode: hasFeature(stateObj, FAN_FEATURE.PRESET_MODE),
  };
}

// ---- Lock ----------------------------------------------------------------
export const LOCK_FEATURE = { OPEN: 1 } as const;

// ---- Weather -------------------------------------------------------------
export const WEATHER_FEATURE = { FORECAST_DAILY: 1, FORECAST_HOURLY: 2, FORECAST_TWICE_DAILY: 4 } as const;
