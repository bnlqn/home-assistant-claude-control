import type { HassEntity } from "../../types/hass.js";

/**
 * Default iconography, resolved in priority order by the adapter:
 *   config.icon → entity attribute icon → this table → domain fallback.
 * The dashboard renders mdi glyphs itself (see primitives/entity-icon.ts), so
 * these are plain `mdi:*` names with no external icon dependency.
 */

const DEVICE_CLASS_ICONS: Record<string, Record<string, string>> = {
  binary_sensor: {
    motion: "mdi:motion-sensor",
    door: "mdi:door",
    window: "mdi:window-closed-variant",
    garage_door: "mdi:garage",
    moisture: "mdi:water-alert",
    smoke: "mdi:smoke-detector",
    gas: "mdi:gas-cylinder",
    problem: "mdi:alert-circle",
    connectivity: "mdi:lan-connect",
    occupancy: "mdi:home-account",
    presence: "mdi:home-account",
    lock: "mdi:lock",
    opening: "mdi:square-outline",
    battery: "mdi:battery-alert",
    power: "mdi:power-plug",
  },
  sensor: {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    power: "mdi:flash",
    energy: "mdi:lightning-bolt",
    battery: "mdi:battery",
    pressure: "mdi:gauge",
    illuminance: "mdi:brightness-5",
    voltage: "mdi:sine-wave",
    current: "mdi:current-ac",
    gas: "mdi:meter-gas",
    carbon_dioxide: "mdi:molecule-co2",
    pm25: "mdi:air-filter",
  },
  cover: {
    door: "mdi:door",
    garage: "mdi:garage",
    shade: "mdi:roller-shade",
    blind: "mdi:blinds",
    curtain: "mdi:curtains",
    window: "mdi:window-shutter",
    awning: "mdi:awning-outline",
    gate: "mdi:gate",
  },
};

const DOMAIN_ICONS: Record<string, string> = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch-variant",
  fan: "mdi:fan",
  climate: "mdi:thermostat",
  cover: "mdi:window-shutter",
  media_player: "mdi:cast",
  sensor: "mdi:eye",
  binary_sensor: "mdi:radiobox-blank",
  person: "mdi:account",
  device_tracker: "mdi:crosshairs-gps",
  scene: "mdi:palette",
  script: "mdi:script-text",
  button: "mdi:gesture-tap-button",
  lock: "mdi:lock",
  vacuum: "mdi:robot-vacuum",
  camera: "mdi:cctv",
  weather: "mdi:weather-partly-cloudy",
  alarm_control_panel: "mdi:shield-home",
  automation: "mdi:robot",
  input_boolean: "mdi:toggle-switch",
};

export function defaultIcon(domain: string, stateObj: HassEntity | undefined): string {
  const dc = stateObj?.attributes.device_class as string | undefined;
  if (dc && DEVICE_CLASS_ICONS[domain]?.[dc]) return DEVICE_CLASS_ICONS[domain][dc];
  return DOMAIN_ICONS[domain] ?? "mdi:help-circle-outline";
}

/** Map weather condition → mdi glyph. */
export function weatherIcon(condition: string): string {
  const map: Record<string, string> = {
    "clear-night": "mdi:weather-night",
    cloudy: "mdi:weather-cloudy",
    fog: "mdi:weather-fog",
    hail: "mdi:weather-hail",
    lightning: "mdi:weather-lightning",
    "lightning-rainy": "mdi:weather-lightning-rainy",
    partlycloudy: "mdi:weather-partly-cloudy",
    pouring: "mdi:weather-pouring",
    rainy: "mdi:weather-rainy",
    snowy: "mdi:weather-snowy",
    "snowy-rainy": "mdi:weather-snowy-rainy",
    sunny: "mdi:weather-sunny",
    windy: "mdi:weather-windy",
    "windy-variant": "mdi:weather-windy-variant",
    exceptional: "mdi:alert-circle-outline",
  };
  return map[condition] ?? "mdi:weather-cloudy";
}

/** Battery glyph reflecting level + charging. */
export function batteryIcon(level: number, charging: boolean): string {
  const rounded = Math.round(level / 10) * 10;
  if (charging) {
    if (rounded >= 100) return "mdi:battery-charging-100";
    if (rounded <= 10) return "mdi:battery-charging-10";
    return `mdi:battery-charging-${rounded}`;
  }
  if (rounded >= 100) return "mdi:battery";
  if (rounded <= 5) return "mdi:battery-alert-variant-outline";
  return `mdi:battery-${rounded}`;
}
