import type {
  SectionKind,
  WidgetConfigOf,
  WidgetSize,
  WidgetSizeSet,
  WidgetType,
} from "../config/schema.js";
import type {
  ClimateSwitchOption,
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
  | "weather";

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

type MigratedWidgetType =
  | "light"
  | "climate"
  | "switch"
  | "fan"
  | "cover"
  | "lock"
  | "vacuum"
  | "media"
  | "sensor"
  | "weather";
type WidgetDefinitionMap = {
  [Type in MigratedWidgetType]: WidgetDefinition<Type>;
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
} satisfies WidgetDefinitionMap;

type AnyWidgetDefinitionMap = {
  [Type in WidgetType]: WidgetDefinition<Type>;
};

export const WIDGET_DEFINITIONS: Readonly<Partial<AnyWidgetDefinitionMap>> = DEFINITIONS;

export function widgetDefinition<Type extends WidgetType>(type: Type): WidgetDefinition<Type> | undefined {
  return WIDGET_DEFINITIONS[type];
}
