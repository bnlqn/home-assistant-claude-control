import type {
  SectionKind,
  WidgetConfig,
  WidgetSize,
  WidgetSizeSet,
  WidgetType,
} from "../config/schema.js";

export interface WidgetOptionIssue {
  /** Path relative to `options`, such as `switches[0].entity`. */
  path: string;
  message: string;
}

export type WidgetQuickAction = "toggle" | "activate" | "none";
export type WidgetDetailRenderer = "light" | "climate";

/**
 * The single contract for a reusable dashboard widget.
 *
 * A definition owns the metadata that used to be spread across the renderer,
 * config validator, layout classifier and detail surface. Widget-specific UI
 * remains in the widget module itself; this object describes how the dashboard
 * hosts it at every viewport size.
 */
export interface WidgetDefinition {
  type: WidgetType;
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
  dependencyIds: (config: WidgetConfig) => string[];
  validateOptions?: (options: Record<string, unknown> | undefined) => WidgetOptionIssue[];
  /** Controller key resolved by the detail layer, keeping this metadata pure. */
  detailRenderer?: WidgetDetailRenderer;
}

interface ClimateSwitchOption {
  entity: string;
  name: string;
}

const ENTITY_ID_RE = /^[a-z_]+\.[a-z0-9_]+$/;

function climateSwitches(options: Record<string, unknown> | undefined): ClimateSwitchOption[] {
  const switches = options?.switches;
  if (!Array.isArray(switches)) return [];
  return switches.filter(
    (item): item is ClimateSwitchOption =>
      !!item &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).entity === "string" &&
      typeof (item as Record<string, unknown>).name === "string",
  );
}

function validateClimateOptions(options: Record<string, unknown> | undefined): WidgetOptionIssue[] {
  if (options?.switches === undefined) return [];
  if (!Array.isArray(options.switches)) {
    return [{ path: "switches", message: "Climate `switches` must be an array." }];
  }

  const issues: WidgetOptionIssue[] = [];
  options.switches.forEach((item, index) => {
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
} satisfies WidgetDefinition;

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
} satisfies WidgetDefinition;

type MigratedWidgetType = "light" | "climate";
type WidgetDefinitionMap = {
  [Type in MigratedWidgetType]: WidgetDefinition & { type: Type };
};
const DEFINITIONS = {
  light: LIGHT_WIDGET_DEFINITION,
  climate: CLIMATE_WIDGET_DEFINITION,
} satisfies WidgetDefinitionMap;

export const WIDGET_DEFINITIONS: Readonly<Partial<Record<WidgetType, WidgetDefinition>>> = DEFINITIONS;

export function widgetDefinition(type: WidgetType): WidgetDefinition | undefined {
  return WIDGET_DEFINITIONS[type];
}
