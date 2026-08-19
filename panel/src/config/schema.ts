/**
 * Declarative configuration contract for the dashboard.
 *
 * This is the ONLY place entity IDs live. Widgets never hardcode entities —
 * they receive them through this config. To retarget the dashboard at a
 * different Home Assistant, edit `dashboard.config.ts`; touch nothing else.
 */

/** The four — and only four — approved widget footprints. */
export type WidgetSize = "1x1" | "2x1" | "1x2" | "2x2";

export const ALL_SIZES: readonly WidgetSize[] = ["1x1", "2x1", "1x2", "2x2"] as const;

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
  | "alarm"
  | "action";

export const ALL_WIDGET_TYPES: readonly WidgetType[] = [
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
  "alarm",
  "action",
] as const;

export type ViewType = "overview" | "room" | "system";

export interface WidgetConfig {
  /** Stable, unique id (used for keying, focus restoration, deep links). */
  id: string;
  type: WidgetType;
  /** Primary entity the widget represents. Optional for composite widgets. */
  entity?: string;
  /** Optional override of the entity's friendly name. */
  name?: string;
  /** Optional override of the widget icon (mdi:* or a bare glyph name). */
  icon?: string;
  size: WidgetSizeSet;
  /** Require a confirmation dialog before the widget's quick action runs. */
  requiresConfirmation?: boolean;
  /**
   * Widget-specific extras (e.g. an energy widget's related sensors, a media
   * widget's paired receiver). Kept loose on purpose; each widget documents
   * the keys it reads.
   */
  options?: Record<string, unknown>;
}

export interface ViewConfig {
  id: string;
  type: ViewType;
  label: string;
  icon: string;
  /** Optional subtitle shown under the view title in the shell. */
  subtitle?: string;
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
export const SUPPORTED_SIZES: Record<WidgetType, readonly WidgetSize[]> = {
  light: ["1x1", "2x1", "1x2", "2x2"],
  switch: ["1x1", "2x1"],
  fan: ["1x1", "2x1", "1x2"],
  climate: ["2x1", "1x2", "2x2"],
  cover: ["1x1", "2x1", "1x2", "2x2"],
  media: ["2x1", "2x2"],
  sensor: ["1x1", "2x1", "1x2", "2x2"],
  binary_sensor: ["1x1", "2x1"],
  person: ["1x1", "2x1"],
  scene: ["1x1", "2x1", "1x2"],
  script: ["1x1", "2x1"],
  button: ["1x1", "2x1"],
  lock: ["1x1", "2x1"],
  vacuum: ["1x1", "2x1", "2x2"],
  camera: ["2x1", "2x2"],
  weather: ["2x1", "1x2", "2x2"],
  energy: ["2x1", "1x2", "2x2"],
  powerflow: ["2x2"],
  alarm: ["1x1", "2x1", "2x2"],
  action: ["1x1", "2x1"],
};

/** A widget type must supply an `entity` unless it is one of these. */
export const ENTITYLESS_TYPES: readonly WidgetType[] = ["energy", "powerflow", "action"];
