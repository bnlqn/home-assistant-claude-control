/**
 * Declarative configuration contract for the dashboard.
 *
 * This is the ONLY place entity IDs live. Widgets never hardcode entities —
 * they receive them through this config. To retarget the dashboard at a
 * different Home Assistant, edit `dashboard.config.ts`; touch nothing else.
 */

import type {
  ClimateWidgetOptions,
  ElectricityTotalWidgetOptions,
  EnergyChartWidgetOptions,
  EnergyWidgetOptions,
  PowerflowWidgetOptions,
  SolarChargingWidgetOptions,
  VacuumWidgetOptions,
} from "./widget-options.js";

export type {
  ClimateSwitchOption,
  ClimateWidgetOptions,
  ElectricityTotalWidgetOptions,
  EnergyChartPeriod,
  EnergyChartWidgetOptions,
  EnergyWidgetOptions,
  PowerflowWidgetOptions,
  SolarChargingWidgetOptions,
  VacuumWidgetOptions,
} from "./widget-options.js";

/**
 * Approved widget footprints. The core set is the four base tiles; `3x3` is an
 * "XL" footprint reserved for genuinely diagram-scale widgets (the power-flow
 * hero) whose contents are size-capped and only need more *whitespace* to
 * breathe. `4x2` is a wide banner for width-hungry widgets (the energy chart).
 * Not every widget may use these (see widget definitions and legacy sizes).
 */
export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2" | "3x3" | "4x2";

export const ALL_SIZES: readonly WidgetSize[] = ["1x1", "2x1", "1x2", "2x2", "3x3", "4x2"] as const;

/** Responsive breakpoint buckets, resolved against the panel's own width. */
export type Breakpoint = "compact" | "medium" | "wide";

export const BREAKPOINTS: readonly Breakpoint[] = ["compact", "medium", "wide"] as const;

/** A widget's footprint at each breakpoint. */
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

export type TypedOptionsWidgetType =
  | "light"
  | "climate"
  | "switch"
  | "fan"
  | "cover"
  | "lock"
  | "vacuum"
  | "media"
  | "sensor"
  | "weather"
  | "energy"
  | "powerflow"
  | "solarcharging"
  | "energychart"
  | "electricitytotal";

export type LooseOptionsWidgetType = Exclude<WidgetType, TypedOptionsWidgetType>;

/** One discriminated configuration variant per not-yet-migrated widget type. */
export type LegacyWidgetConfig = {
  [Type in LooseOptionsWidgetType]: WidgetConfigBase<Type> & {
    /** Retained only until this widget type receives a typed option contract. */
    options?: Record<string, unknown>;
  };
}[LooseOptionsWidgetType];

/**
 * Widget configuration is discriminated by `type`. Migrated widgets reject
 * options belonging to another widget at compile time; the legacy branch is
 * deliberately restricted to widget types not yet migrated.
 */
export type WidgetConfig =
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
  | EnergyWidgetConfig
  | PowerflowWidgetConfig
  | SolarChargingWidgetConfig
  | EnergyChartWidgetConfig
  | ElectricityTotalWidgetConfig
  | LegacyWidgetConfig;

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

/**
 * Which sizes each widget type can render usefully. Config using a size not in
 * this set is rejected at startup with a clear message, rather than producing a
 * cramped or empty-looking widget.
 */
export type LegacyWidgetType = Exclude<
  WidgetType,
  | "light"
  | "climate"
  | "switch"
  | "fan"
  | "cover"
  | "lock"
  | "vacuum"
  | "media"
  | "sensor"
  | "weather"
>;

/**
 * Size constraints for widgets not yet migrated to `WidgetDefinition`.
 * Migrated widgets own this metadata beside their implementation instead.
 */
export const LEGACY_SUPPORTED_SIZES: Record<LegacyWidgetType, readonly WidgetSize[]> = {
  // A container is full-width and self-sizing; the grid ignores its footprint,
  // so every size is permitted (synthetic groups carry a nominal one).
  group: ALL_SIZES,
  binary_sensor: ["1x1", "2x1"],
  person: ["1x1", "2x1"],
  scene: ["1x1", "2x1", "1x2"],
  script: ["1x1", "2x1"],
  button: ["1x1", "2x1"],
  camera: ["2x1", "2x2"],
  energy: ["2x1", "1x2", "2x2"],
  powerflow: ["2x2", "3x3"],
  solarcharging: ["2x1", "1x2", "2x2"],
  energychart: ["2x2", "4x2"],
  // Homey-style wide status tile (icon + name + "value • status"); one per grid cell.
  metrictile: ["1x1", "2x1"],
  // Full-width "Imported − Exported = Total" breakdown band.
  electricitytotal: ["2x2", "4x2"],
  alarm: ["1x1", "2x1", "2x2"],
  action: ["1x1", "2x1"],
};

/** A widget type must supply an `entity` unless it is one of these. */
export const LEGACY_ENTITYLESS_TYPES: readonly LegacyWidgetType[] = [
  "group",
  "energy",
  "powerflow",
  "solarcharging",
  "energychart",
  "electricitytotal",
  "action",
];
