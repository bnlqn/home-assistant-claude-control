import type {
  GroupOptions,
  SectionKind,
  WidgetConfig,
  WidgetConfigOf,
  WidgetSize,
  WidgetSizeSet,
  WidgetType,
} from "../config/schema.js";
import { ALL_SIZES, SECTION_KINDS } from "../config/schema.js";
import type {
  ActionWidgetOptions,
  ClimateSwitchOption,
  MetricTileWidgetOptions,
  VacuumWidgetOptions,
} from "../config/widget-options.js";

export interface WidgetOptionIssue {
  /** Path relative to `options`, such as `switches[0].entity`. */
  path: string;
  message: string;
}

export type WidgetQuickAction = "toggle" | "activate" | "none";
export type WidgetDetailRenderer =
  | "light"
  | "climate"
  | "generic"
  | "cover"
  | "lock"
  | "vacuum"
  | "media"
  | "sensor"
  | "weather"
  | "energy"
  | "powerflow"
  | "solarcharging";

/**
 * The single contract for a reusable dashboard widget.
 *
 * A definition owns the metadata that used to be spread across the renderer,
 * config validator, layout classifier and detail surface. Widget-specific UI
 * remains in the widget module itself; this object describes how the dashboard
 * hosts it at every viewport size.
 */
export interface WidgetDefinition<Type extends WidgetType = WidgetType> {
  type: Type;
  tag: string;
  label: string;
  icon: string;
  load: () => Promise<unknown>;
  supportedSizes: readonly WidgetSize[];
  defaultSize: WidgetSizeSet;
  requiresEntity: boolean;
  section: SectionKind;
  quickAction: WidgetQuickAction;
  hasDetail: boolean;
  dependencyIds: (config: WidgetConfigOf<Type>) => string[];
  validateOptions?: (options: unknown) => WidgetOptionIssue[];
  /** Controller key resolved by the detail layer, keeping this metadata pure. */
  detailRenderer?: WidgetDetailRenderer;
}

const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;

function isOptionRecord(options: unknown): options is Record<string, unknown> {
  return !!options && typeof options === "object" && !Array.isArray(options);
}

function climateSwitches(options: unknown): ClimateSwitchOption[] {
  const switches = isOptionRecord(options) ? options.switches : undefined;
  if (!Array.isArray(switches)) return [];
  return switches.filter(
    (item): item is ClimateSwitchOption =>
      !!item &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).entity === "string" &&
      typeof (item as Record<string, unknown>).name === "string",
  );
}

function validateClimateOptions(options: unknown): WidgetOptionIssue[] {
  const switches = isOptionRecord(options) ? options.switches : undefined;
  if (switches === undefined) return [];
  if (!Array.isArray(switches)) {
    return [{ path: "switches", message: "Climate `switches` must be an array." }];
  }

  const issues: WidgetOptionIssue[] = [];
  switches.forEach((item, index) => {
    const value = item && typeof item === "object"
      ? item as Record<string, unknown>
      : undefined;
    if (!value) {
      issues.push({ path: `switches[${index}]`, message: "Climate switch must be an object." });
      return;
    }
    if (typeof value.entity !== "string" || !ENTITY_ID_RE.test(value.entity)) {
      issues.push({
        path: `switches[${index}].entity`,
        message: "Climate switch requires a valid entity_id.",
      });
    }
    if (typeof value.name !== "string" || !value.name.trim()) {
      issues.push({
        path: `switches[${index}].name`,
        message: "Climate switch requires a non-empty name.",
      });
    }
  });
  return issues;
}

function validateVacuumOptions(options: unknown): WidgetOptionIssue[] {
  if (options === undefined) return [];
  if (!isOptionRecord(options)) {
    return [{ path: "", message: "Vacuum options must be an object." }];
  }
  const value = options as Partial<VacuumWidgetOptions>;
  const issues: WidgetOptionIssue[] = [];
  if (value.brand !== undefined && value.brand !== "roborock") {
    issues.push({ path: "brand", message: "Vacuum `brand` must be `roborock`." });
  }
  if (value.branded !== undefined && typeof value.branded !== "boolean") {
    issues.push({ path: "branded", message: "Vacuum `branded` must be a boolean." });
  }
  if (value.hero !== undefined && typeof value.hero !== "boolean") {
    issues.push({ path: "hero", message: "Vacuum `hero` must be a boolean." });
  }
  return issues;
}

function validateActionOptions(options: unknown): WidgetOptionIssue[] {
  if (!isOptionRecord(options)) {
    return [{ path: "", message: "Action options must be an object." }];
  }
  const value = options as Partial<ActionWidgetOptions>;
  const issues: WidgetOptionIssue[] = [];
  if (typeof value.service !== "string" || !/^[a-z_]+\.[a-z_]+$/.test(value.service)) {
    issues.push({ path: "service", message: "Action `service` must use `domain.service` form." });
  }
  if (value.data !== undefined && !isOptionRecord(value.data)) {
    issues.push({ path: "data", message: "Action `data` must be an object." });
  }
  if (value.target !== undefined && !isOptionRecord(value.target)) {
    issues.push({ path: "target", message: "Action `target` must be an object." });
  }
  return issues;
}

function configuredEntityIds(value: unknown): string[] {
  if (typeof value === "string") return ENTITY_ID_RE.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(configuredEntityIds);
  if (!value || typeof value !== "object") return [];
  return Object.values(value as Record<string, unknown>).flatMap(configuredEntityIds);
}

function widgetDependencyIds(config: WidgetConfig): string[] {
  const ids = config.entity ? [config.entity] : [];
  if (config.type === "action") return ids;
  ids.push(...configuredEntityIds(config.options));
  return [...new Set(ids)];
}

function validateEntityOptions(
  options: unknown,
  label: string,
  keys: readonly string[],
): WidgetOptionIssue[] {
  if (options === undefined) return [];
  if (!isOptionRecord(options)) {
    return [{ path: "", message: `${label} options must be an object.` }];
  }
  const issues: WidgetOptionIssue[] = [];
  for (const key of keys) {
    const entityId = options[key];
    if (entityId !== undefined && (typeof entityId !== "string" || !ENTITY_ID_RE.test(entityId))) {
      issues.push({ path: key, message: `${label} \`${key}\` must be a valid entity_id.` });
    }
  }
  return issues;
}

function validateGroupOptions(options: unknown): WidgetOptionIssue[] {
  if (!isOptionRecord(options)) return [{ path: "", message: "Group options must be an object." }];
  const value = options as Partial<GroupOptions>;
  const issues: WidgetOptionIssue[] = [];
  if (value.label !== undefined && typeof value.label !== "string") {
    issues.push({ path: "label", message: "Group `label` must be a string." });
  }
  if (value.variant !== undefined && !SECTION_KINDS.includes(value.variant)) {
    issues.push({ path: "variant", message: `Group \`variant\` must be one of: ${SECTION_KINDS.join(", ")}.` });
  }
  if (!Array.isArray(value.children) || value.children.length === 0) {
    issues.push({ path: "children", message: "Group `children` must be a non-empty array." });
  }
  return issues;
}

function validateMetricTileOptions(options: unknown): WidgetOptionIssue[] {
  const issues = validateEntityOptions(options, "Metric tile", ["chargeStatus", "connected"]);
  if (!isOptionRecord(options)) return issues;
  const value = options as Partial<MetricTileWidgetOptions>;
  const accents = ["idle", "unavailable", "accent", "light", "heat", "cool", "eco", "warn", "alert"];
  if (value.accent !== undefined && !accents.includes(value.accent)) {
    issues.push({ path: "accent", message: "Metric tile `accent` is not supported." });
  }
  if (value.format !== undefined && !["power", "percent", "state"].includes(value.format)) {
    issues.push({ path: "format", message: "Metric tile `format` is not supported." });
  }
  if (value.status !== undefined && !["gridDirection", "carCharge", "none"].includes(value.status)) {
    issues.push({ path: "status", message: "Metric tile `status` is not supported." });
  }
  return issues;
}

const SOLAR_CHARGING_ENTITY_KEYS = [
  "master",
  "vehicleConnected",
  "chargingState",
  "wallStatus",
  "chargePower",
  "battery",
  "chargeLimit",
  "sessionEnergy",
  "chargeRate",
  "chargeCurrent",
  "startThreshold",
  "stopThreshold",
  "minCurrent",
  "deadband",
] as const;

function validateSolarChargingOptions(options: unknown): WidgetOptionIssue[] {
  const issues = validateEntityOptions(options, "Solar charging", SOLAR_CHARGING_ENTITY_KEYS);
  if (!isOptionRecord(options)) return issues;
  if (options.brand !== undefined && options.brand !== "tesla") {
    issues.push({ path: "brand", message: "Solar charging `brand` must be `tesla`." });
  }
  if (options.branded !== undefined && typeof options.branded !== "boolean") {
    issues.push({ path: "branded", message: "Solar charging `branded` must be a boolean." });
  }
  return issues;
}

function validateEnergyChartOptions(options: unknown): WidgetOptionIssue[] {
  const issues = validateEntityOptions(options, "Energy chart", ["gridImport", "gridExport", "solar", "car"]);
  if (!isOptionRecord(options)) return issues;
  if (options.defaultPeriod !== undefined && !["day", "week", "month"].includes(options.defaultPeriod as string)) {
    issues.push({ path: "defaultPeriod", message: "Energy chart `defaultPeriod` must be day, week, or month." });
  }
  return issues;
}

export const LIGHT_WIDGET_DEFINITION = {
  type: "light",
  tag: "hd-widget-light",
  label: "Light",
  icon: "mdi:lightbulb",
  load: () => import("./light.js"),
  supportedSizes: ["1x1", "2x1", "1x2", "2x2"],
  defaultSize: { compact: "1x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "devices",
  quickAction: "toggle",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "light",
} satisfies WidgetDefinition<"light">;

export const CLIMATE_WIDGET_DEFINITION = {
  type: "climate",
  tag: "hd-widget-climate",
  label: "Climate",
  icon: "mdi:thermostat",
  load: () => import("./climate.js"),
  supportedSizes: ["2x1", "1x2", "2x2"],
  defaultSize: { compact: "2x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "devices",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => [
    ...(config.entity ? [config.entity] : []),
    ...climateSwitches(config.options).map((item) => item.entity),
  ],
  validateOptions: validateClimateOptions,
  detailRenderer: "climate",
} satisfies WidgetDefinition<"climate">;

export const SWITCH_WIDGET_DEFINITION = {
  type: "switch",
  tag: "hd-widget-switch",
  label: "Switch",
  icon: "mdi:toggle-switch",
  load: () => import("./switch.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "devices",
  quickAction: "toggle",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "generic",
} satisfies WidgetDefinition<"switch">;

export const FAN_WIDGET_DEFINITION = {
  type: "fan",
  tag: "hd-widget-fan",
  label: "Fan",
  icon: "mdi:fan",
  load: () => import("./fan.js"),
  supportedSizes: ["1x1", "2x1", "1x2"],
  defaultSize: { compact: "1x1", medium: "2x1", wide: "2x1" },
  requiresEntity: true,
  section: "devices",
  quickAction: "toggle",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "generic",
} satisfies WidgetDefinition<"fan">;

export const COVER_WIDGET_DEFINITION = {
  type: "cover",
  tag: "hd-widget-cover",
  label: "Cover",
  icon: "mdi:window-shutter",
  load: () => import("./cover.js"),
  supportedSizes: ["1x1", "2x1", "1x2", "2x2"],
  defaultSize: { compact: "1x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "devices",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "cover",
} satisfies WidgetDefinition<"cover">;

export const LOCK_WIDGET_DEFINITION = {
  type: "lock",
  tag: "hd-widget-lock",
  label: "Lock",
  icon: "mdi:lock",
  load: () => import("./lock.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "devices",
  quickAction: "toggle",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "lock",
} satisfies WidgetDefinition<"lock">;

export const VACUUM_WIDGET_DEFINITION = {
  type: "vacuum",
  tag: "hd-widget-vacuum",
  label: "Vacuum",
  icon: "mdi:robot-vacuum",
  load: () => import("./vacuum.js"),
  supportedSizes: ["1x1", "2x1", "2x2"],
  defaultSize: { compact: "1x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "devices",
  quickAction: "toggle",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  validateOptions: validateVacuumOptions,
  detailRenderer: "vacuum",
} satisfies WidgetDefinition<"vacuum">;

export const MEDIA_WIDGET_DEFINITION = {
  type: "media",
  tag: "hd-widget-media",
  label: "Media",
  icon: "mdi:cast",
  load: () => import("./media.js"),
  supportedSizes: ["2x1", "2x2"],
  defaultSize: { compact: "2x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "media",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "media",
} satisfies WidgetDefinition<"media">;

export const SENSOR_WIDGET_DEFINITION = {
  type: "sensor",
  tag: "hd-widget-sensor",
  label: "Sensor",
  icon: "mdi:gauge",
  load: () => import("./sensor.js"),
  supportedSizes: ["1x1", "2x1", "1x2", "2x2"],
  defaultSize: { compact: "1x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "sensors",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "sensor",
} satisfies WidgetDefinition<"sensor">;

export const WEATHER_WIDGET_DEFINITION = {
  type: "weather",
  tag: "hd-widget-weather",
  label: "Weather",
  icon: "mdi:weather-partly-cloudy",
  load: () => import("./weather.js"),
  supportedSizes: ["2x1", "1x2", "2x2"],
  defaultSize: { compact: "2x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "sensors",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "weather",
} satisfies WidgetDefinition<"weather">;

export const BINARY_SENSOR_WIDGET_DEFINITION = {
  type: "binary_sensor",
  tag: "hd-widget-binary",
  label: "Binary sensor",
  icon: "mdi:checkbox-marked-circle-outline",
  load: () => import("./binary-sensor.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "sensors",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "generic",
} satisfies WidgetDefinition<"binary_sensor">;

export const PERSON_WIDGET_DEFINITION = {
  type: "person",
  tag: "hd-widget-person",
  label: "Person",
  icon: "mdi:account",
  load: () => import("./person.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "sensors",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "generic",
} satisfies WidgetDefinition<"person">;

export const CAMERA_WIDGET_DEFINITION = {
  type: "camera",
  tag: "hd-widget-camera",
  label: "Camera",
  icon: "mdi:cctv",
  load: () => import("./camera.js"),
  supportedSizes: ["2x1", "2x2"],
  defaultSize: { compact: "2x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "devices",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "generic",
} satisfies WidgetDefinition<"camera">;

export const SCENE_WIDGET_DEFINITION = {
  type: "scene",
  tag: "hd-widget-scene",
  label: "Scene",
  icon: "mdi:palette-outline",
  load: () => import("./scene.js"),
  supportedSizes: ["1x1", "2x1", "1x2"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "devices",
  quickAction: "activate",
  hasDetail: false,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
} satisfies WidgetDefinition<"scene">;

export const SCRIPT_WIDGET_DEFINITION = {
  type: "script",
  tag: "hd-widget-script",
  label: "Script",
  icon: "mdi:script-text-outline",
  load: () => import("./script.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "devices",
  quickAction: "activate",
  hasDetail: false,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
} satisfies WidgetDefinition<"script">;

export const BUTTON_WIDGET_DEFINITION = {
  type: "button",
  tag: "hd-widget-button",
  label: "Button",
  icon: "mdi:gesture-tap-button",
  load: () => import("./button.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "devices",
  quickAction: "activate",
  hasDetail: false,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
} satisfies WidgetDefinition<"button">;

export const ALARM_WIDGET_DEFINITION = {
  type: "alarm",
  tag: "hd-widget-alarm",
  label: "Alarm",
  icon: "mdi:shield-home-outline",
  load: () => import("./alarm.js"),
  supportedSizes: ["1x1", "2x1", "2x2"],
  defaultSize: { compact: "1x1", medium: "2x1", wide: "2x2" },
  requiresEntity: true,
  section: "devices",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => config.entity ? [config.entity] : [],
  detailRenderer: "generic",
} satisfies WidgetDefinition<"alarm">;

export const ACTION_WIDGET_DEFINITION = {
  type: "action",
  tag: "hd-widget-action",
  label: "Action",
  icon: "mdi:gesture-tap-button",
  load: () => import("./action.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: false,
  section: "devices",
  quickAction: "activate",
  hasDetail: false,
  dependencyIds: () => [],
  validateOptions: validateActionOptions,
} satisfies WidgetDefinition<"action">;

export const GROUP_WIDGET_DEFINITION = {
  type: "group",
  tag: "hd-group",
  label: "Group",
  icon: "mdi:view-grid-outline",
  load: () => import("./group.js"),
  supportedSizes: ALL_SIZES,
  defaultSize: { compact: "4x2", medium: "4x2", wide: "4x2" },
  requiresEntity: false,
  section: "devices",
  quickAction: "none",
  hasDetail: false,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: validateGroupOptions,
} satisfies WidgetDefinition<"group">;

export const ENERGY_WIDGET_DEFINITION = {
  type: "energy",
  tag: "hd-widget-energy",
  label: "Energy",
  icon: "mdi:lightning-bolt-outline",
  load: () => import("./energy.js"),
  supportedSizes: ["2x1", "1x2", "2x2"],
  defaultSize: { compact: "2x1", medium: "2x2", wide: "2x2" },
  requiresEntity: false,
  section: "energy",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: (options) => validateEntityOptions(options, "Energy", [
    "gridPower", "solarPower", "solarToday", "forecastEndOfDay", "solarForecastRemaining",
  ]),
  detailRenderer: "energy",
} satisfies WidgetDefinition<"energy">;

export const POWERFLOW_WIDGET_DEFINITION = {
  type: "powerflow",
  tag: "hd-widget-powerflow",
  label: "Power flow",
  icon: "mdi:transmission-tower",
  load: () => import("./powerflow.js"),
  supportedSizes: ["2x2", "3x3"],
  defaultSize: { compact: "2x2", medium: "3x3", wide: "3x3" },
  requiresEntity: false,
  section: "energy",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: (options) => validateEntityOptions(options, "Power flow", [
    "gridPower", "solarPower", "houseConsumption", "carPower", "carPowerAlt", "carActive", "carActiveAlt",
  ]),
  detailRenderer: "powerflow",
} satisfies WidgetDefinition<"powerflow">;

export const SOLAR_CHARGING_WIDGET_DEFINITION = {
  type: "solarcharging",
  tag: "hd-widget-solarcharging",
  label: "Solar charging",
  icon: "mdi:car-electric",
  load: () => import("./solarcharging.js"),
  supportedSizes: ["2x1", "1x2", "2x2"],
  defaultSize: { compact: "2x1", medium: "2x2", wide: "2x2" },
  requiresEntity: false,
  section: "energy",
  quickAction: "toggle",
  hasDetail: true,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: validateSolarChargingOptions,
  detailRenderer: "solarcharging",
} satisfies WidgetDefinition<"solarcharging">;

export const ENERGY_CHART_WIDGET_DEFINITION = {
  type: "energychart",
  tag: "hd-widget-energychart",
  label: "Energy chart",
  icon: "mdi:chart-bar",
  load: () => import("./energychart.js"),
  supportedSizes: ["2x2", "4x2"],
  defaultSize: { compact: "2x2", medium: "4x2", wide: "4x2" },
  requiresEntity: false,
  section: "energy",
  quickAction: "none",
  hasDetail: false,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: validateEnergyChartOptions,
} satisfies WidgetDefinition<"energychart">;

export const METRIC_TILE_WIDGET_DEFINITION = {
  type: "metrictile",
  tag: "hd-widget-metrictile",
  label: "Metric tile",
  icon: "mdi:gauge",
  load: () => import("./metric-tile.js"),
  supportedSizes: ["1x1", "2x1"],
  defaultSize: { compact: "1x1", medium: "1x1", wide: "2x1" },
  requiresEntity: true,
  section: "energy",
  quickAction: "none",
  hasDetail: true,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: validateMetricTileOptions,
  detailRenderer: "generic",
} satisfies WidgetDefinition<"metrictile">;

export const ELECTRICITY_TOTAL_WIDGET_DEFINITION = {
  type: "electricitytotal",
  tag: "hd-widget-electricitytotal",
  label: "Electricity total",
  icon: "mdi:flash",
  load: () => import("./electricity-total.js"),
  supportedSizes: ["2x2", "4x2"],
  defaultSize: { compact: "2x2", medium: "4x2", wide: "4x2" },
  requiresEntity: false,
  section: "energy",
  quickAction: "none",
  hasDetail: false,
  dependencyIds: (config) => widgetDependencyIds(config),
  validateOptions: (options) => validateEntityOptions(options, "Electricity total", [
    "importEnergy", "exportEnergy",
  ]),
} satisfies WidgetDefinition<"electricitytotal">;

type WidgetDefinitionMap = {
  [Type in WidgetType]: WidgetDefinition<Type>;
};
const DEFINITIONS = {
  light: LIGHT_WIDGET_DEFINITION,
  climate: CLIMATE_WIDGET_DEFINITION,
  switch: SWITCH_WIDGET_DEFINITION,
  fan: FAN_WIDGET_DEFINITION,
  cover: COVER_WIDGET_DEFINITION,
  lock: LOCK_WIDGET_DEFINITION,
  vacuum: VACUUM_WIDGET_DEFINITION,
  media: MEDIA_WIDGET_DEFINITION,
  sensor: SENSOR_WIDGET_DEFINITION,
  weather: WEATHER_WIDGET_DEFINITION,
  binary_sensor: BINARY_SENSOR_WIDGET_DEFINITION,
  person: PERSON_WIDGET_DEFINITION,
  camera: CAMERA_WIDGET_DEFINITION,
  scene: SCENE_WIDGET_DEFINITION,
  script: SCRIPT_WIDGET_DEFINITION,
  button: BUTTON_WIDGET_DEFINITION,
  alarm: ALARM_WIDGET_DEFINITION,
  action: ACTION_WIDGET_DEFINITION,
  group: GROUP_WIDGET_DEFINITION,
  energy: ENERGY_WIDGET_DEFINITION,
  powerflow: POWERFLOW_WIDGET_DEFINITION,
  solarcharging: SOLAR_CHARGING_WIDGET_DEFINITION,
  energychart: ENERGY_CHART_WIDGET_DEFINITION,
  metrictile: METRIC_TILE_WIDGET_DEFINITION,
  electricitytotal: ELECTRICITY_TOTAL_WIDGET_DEFINITION,
} satisfies WidgetDefinitionMap;

export const WIDGET_DEFINITIONS: Readonly<WidgetDefinitionMap> = DEFINITIONS;

export function widgetDefinition<Type extends WidgetType>(type: Type): WidgetDefinition<Type> {
  return WIDGET_DEFINITIONS[type];
}
