/**
 * Declarative configuration contract for the dashboard.
 *
 * This is the ONLY place entity IDs live. Widgets never hardcode entities —
 * they receive them through this config. To retarget the dashboard at a
 * different Home Assistant, edit `dashboard.config.ts`; touch nothing else.
 */

import type {
  ActionWidgetOptions,
  ClimateWidgetOptions,
  ElectricityTotalWidgetOptions,
  EnergyChartWidgetOptions,
  EnergyWidgetOptions,
  MetricTileWidgetOptions,
  PowerflowWidgetOptions,
  SolarChargingWidgetOptions,
  VacuumWidgetOptions,
} from "./widget-options.js";

export type {
  ActionWidgetOptions,
  ActionWidgetTarget,
  ClimateSwitchOption,
  ClimateWidgetOptions,
  ElectricityTotalWidgetOptions,
  EnergyChartPeriod,
  EnergyChartWidgetOptions,
  EnergyWidgetOptions,
  MetricTileAccent,
  MetricTileWidgetOptions,
  PowerflowWidgetOptions,
  SolarChargingWidgetOptions,
  VacuumWidgetOptions,
} from "./widget-options.js";

/**
 * Approved widget footprints. The core set is the four base tiles; `3x3` is an
 * "XL" footprint reserved for genuinely diagram-scale widgets (the power-flow
 * hero) whose contents are size-capped and only need more *whitespace* to
 * breathe. `4x2` is a wide banner for width-hungry widgets (the energy chart).
 * Not every widget may use these (see `widget-definition.ts`).
 */
export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2" | "3x3" | "4x2";

export const ALL_SIZES: readonly WidgetSize[] = ["1x1", "2x1", "1x2", "2x2", "3x3", "4x2"] as const;

/** Widget-anatomy buckets selected by the active shape-aware display profile. */
export type Breakpoint = "compact" | "medium" | "wide";

export const BREAKPOINTS: readonly Breakpoint[] = ["compact", "medium", "wide"] as const;

/** A widget's footprint for each compact, medium, or wide anatomy bucket. */
export interface WidgetSizeSet {
  compact: WidgetSize;
  medium: WidgetSize;
  wide: WidgetSize;
}

/** Widget kinds backed by the widget registry. */
export type WidgetType =
  | "group"
  | "light"
  | "switch"
  | "fan"
  | "climate"
  | "cover"
  | "media"
  | "sensor"
  | "binary_sensor"
  | "person"
  | "scene"
  | "script"
  | "button"
  | "lock"
  | "vacuum"
  | "camera"
  | "weather"
  | "energy"
  | "powerflow"
  | "solarcharging"
  | "energychart"
  | "metrictile"
  | "electricitytotal"
  | "alarm"
  | "action";

export const ALL_WIDGET_TYPES: readonly WidgetType[] = [
  "group",
  "light",
  "switch",
  "fan",
  "climate",
  "cover",
  "media",
  "sensor",
  "binary_sensor",
  "person",
  "scene",
  "script",
  "button",
  "lock",
  "vacuum",
  "camera",
  "weather",
  "energy",
  "powerflow",
  "solarcharging",
  "energychart",
  "metrictile",
  "electricitytotal",
  "alarm",
  "action",
] as const;

export type ViewType = "overview" | "room" | "system";

/**
 * Domain-oriented section a widget auto-collects into (see `layout.ts`). Also
 * the `variant` a `group` container renders as: media hero band, small device
 * tiles, read-only value tiles, or an energy/diagram band.
 */
export type SectionKind = "media" | "devices" | "sensors" | "energy" | "tiles";

export const SECTION_KINDS: readonly SectionKind[] = ["media", "devices", "sensors", "energy", "tiles"] as const;

/**
 * Options for a `group` container widget. A container owns a titled section and
 * its own internal responsive grid. By default sections are produced
 * automatically by domain (`sectioniseView`); an explicit `group` in config
 * with `children` overrides that for hand-picked layouts.
 */
export interface GroupOptions {
  /** Heading shown above the section. */
  label?: string;
  /** Which internal layout the container renders (defaults from its widgets). */
  variant?: SectionKind;
  /** Explicit children. When present, the container is NOT auto-collected. */
  children?: WidgetConfig[];
}

interface WidgetConfigBase<Type extends WidgetType> {
  /** Stable, unique id (used for keying, focus restoration, deep links). */
  id: string;
  type: Type;
  /** Primary entity the widget represents. Optional for composite widgets. */
  entity?: string;
  /** Optional override of the entity's friendly name. */
  name?: string;
  /** Optional override of the widget icon (mdi:* or a bare glyph name). */
  icon?: string;
  size: WidgetSizeSet;
  /** Require a confirmation dialog before the widget's quick action runs. */
  requiresConfirmation?: boolean;
}

export interface LightWidgetConfig extends WidgetConfigBase<"light"> {
  options?: never;
}

export interface ClimateWidgetConfig extends WidgetConfigBase<"climate"> {
  options?: ClimateWidgetOptions;
}

export interface SwitchWidgetConfig extends WidgetConfigBase<"switch"> {
  options?: never;
}

export interface FanWidgetConfig extends WidgetConfigBase<"fan"> {
  options?: never;
}

export interface CoverWidgetConfig extends WidgetConfigBase<"cover"> {
  options?: never;
}

export interface LockWidgetConfig extends WidgetConfigBase<"lock"> {
  options?: never;
}

export interface VacuumWidgetConfig extends WidgetConfigBase<"vacuum"> {
  options?: VacuumWidgetOptions;
}

export interface MediaWidgetConfig extends WidgetConfigBase<"media"> {
  options?: never;
}

export interface SensorWidgetConfig extends WidgetConfigBase<"sensor"> {
  options?: never;
}

export interface WeatherWidgetConfig extends WidgetConfigBase<"weather"> {
  options?: never;
}

export interface BinarySensorWidgetConfig extends WidgetConfigBase<"binary_sensor"> {
  options?: never;
}

export interface PersonWidgetConfig extends WidgetConfigBase<"person"> {
  options?: never;
}

export interface CameraWidgetConfig extends WidgetConfigBase<"camera"> {
  options?: never;
}

export interface SceneWidgetConfig extends WidgetConfigBase<"scene"> {
  options?: never;
}

export interface ScriptWidgetConfig extends WidgetConfigBase<"script"> {
  options?: never;
}

export interface ButtonWidgetConfig extends WidgetConfigBase<"button"> {
  options?: never;
}

export interface AlarmWidgetConfig extends WidgetConfigBase<"alarm"> {
  options?: never;
}

export interface ActionWidgetConfig extends WidgetConfigBase<"action"> {
  options: ActionWidgetOptions;
}

export interface GroupWidgetConfig extends WidgetConfigBase<"group"> {
  options: GroupOptions;
}

export interface MetricTileWidgetConfig extends WidgetConfigBase<"metrictile"> {
  options?: MetricTileWidgetOptions;
}

export interface EnergyWidgetConfig extends WidgetConfigBase<"energy"> {
  options?: EnergyWidgetOptions;
}

export interface PowerflowWidgetConfig extends WidgetConfigBase<"powerflow"> {
  options?: PowerflowWidgetOptions;
}

export interface SolarChargingWidgetConfig extends WidgetConfigBase<"solarcharging"> {
  options?: SolarChargingWidgetOptions;
}

export interface EnergyChartWidgetConfig extends WidgetConfigBase<"energychart"> {
  options?: EnergyChartWidgetOptions;
}

export interface ElectricityTotalWidgetConfig extends WidgetConfigBase<"electricitytotal"> {
  options?: ElectricityTotalWidgetOptions;
}

/**
 * Widget configuration is discriminated by `type`. Every widget rejects
 * options belonging to another widget at compile time.
 */
export type WidgetConfig =
  | GroupWidgetConfig
  | LightWidgetConfig
  | ClimateWidgetConfig
  | SwitchWidgetConfig
  | FanWidgetConfig
  | CoverWidgetConfig
  | LockWidgetConfig
  | VacuumWidgetConfig
  | MediaWidgetConfig
  | SensorWidgetConfig
  | WeatherWidgetConfig
  | BinarySensorWidgetConfig
  | PersonWidgetConfig
  | CameraWidgetConfig
  | SceneWidgetConfig
  | ScriptWidgetConfig
  | ButtonWidgetConfig
  | AlarmWidgetConfig
  | ActionWidgetConfig
  | MetricTileWidgetConfig
  | EnergyWidgetConfig
  | PowerflowWidgetConfig
  | SolarChargingWidgetConfig
  | EnergyChartWidgetConfig
  | ElectricityTotalWidgetConfig;

/** Retrieve the strongly typed configuration variant for a widget type. */
export type WidgetConfigOf<Type extends WidgetType> = Extract<WidgetConfig, { type: Type }>;

/**
 * A page-level hero rendered above a view's widget grid. Unlike a widget, it is
 * not part of the grid/section system — it's a full-bleed asset that belongs to
 * the page (currently only the Energy page's house render with overlaid totals
 * and animated flows). See `energy/energy-hero.ts`.
 */
export interface EnergyHeroConfig {
  type: "energy";
  /** Daily grid total (kWh) shown as the "Grid" stat. */
  grid: string;
  /** Daily solar generation (kWh) shown as the "Solar Panels" stat. */
  solar: string;
  /** Live signed grid power (W: +import / −export) — drives the grid flow. */
  gridPower: string;
  /** Live solar power (W) — drives the solar flow glow. */
  solarPower: string;
  /** binary_sensor: EV plugged in — swaps the hero art (car in the garage). */
  carConnected?: string;
  /** Live car charge power (W/kW) — drives the car flow glow when connected. */
  carPower?: string;
  /** Period label shown in the pill (defaults to "Today"). */
  label?: string;
}

export interface ViewConfig {
  id: string;
  type: ViewType;
  label: string;
  icon: string;
  /** Optional subtitle shown under the view title in the shell. */
  subtitle?: string;
  /** Optional full-bleed page hero rendered above the widget grid. */
  hero?: EnergyHeroConfig;
  widgets: WidgetConfig[];
}

export interface KioskConfig {
  enabled: boolean;
  hideHomeAssistantSidebar: boolean;
  preventScreenSelection: boolean;
}

export interface DashboardConfig {
  /** id of the view shown when the panel opens with no sub-route. */
  defaultView: string;
  /** Optional product name shown in the shell (kept generic, not "Homey"). */
  title?: string;
  kiosk?: KioskConfig;
  views: ViewConfig[];
}
