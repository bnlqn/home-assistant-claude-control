import type {
  Breakpoint,
  GroupOptions,
  SectionKind,
  WidgetConfig,
  WidgetSize,
  WidgetType,
} from "../config/schema.js";
import { SECTION_KINDS } from "../config/schema.js";
import { widgetDefinition } from "../widgets/widget-definition.js";

/** Grid metrics derived purely from the panel's measured width. */
export interface GridMetrics {
  columns: number;
  gap: number;
  pad: number;
  bucket: Breakpoint;
}

/**
 * Responsive grid metrics. Breakpoints respond to the PANEL width (container),
 * not the screen — so a sidebar-narrowed panel still lays out correctly.
 */
export function gridMetricsForWidth(width: number): GridMetrics {
  const w = width || 1024;
  if (w < 600) return { columns: 2, gap: 10, pad: 12, bucket: "compact" };
  if (w < 900) return { columns: 4, gap: 14, pad: 20, bucket: "medium" };
  if (w < 1200) return { columns: 6, gap: 16, pad: 24, bucket: "wide" };
  if (w < 1600) return { columns: 8, gap: 16, pad: 28, bucket: "wide" };
  return { columns: 10, gap: 16, pad: 32, bucket: "wide" };
}

/** The widget footprint for the given breakpoint, with safe fallbacks. */
export function resolveWidgetSize(widget: WidgetConfig, bucket: Breakpoint): WidgetSize {
  return widget.size?.[bucket] ?? widget.size?.medium ?? "1x1";
}

/**
 * Whether a child in a uniform tile section should BREAK OUT to its declared
 * footprint instead of the section's 1×1 square. A widget opts in by bringing
 * its own full-bleed surface — flagged via `options.hero` or any `options.brand`
 * (e.g. the Roborock branded hero). Returns the footprint to use, or null to
 * stay a normal square tile. Only sizes larger than 1×1 break out; at narrow
 * breakpoints the widget collapses back to a plain tile.
 */
export function breakoutSizeFor(widget: WidgetConfig, bucket: Breakpoint): WidgetSize | null {
  const options: unknown = widget.options;
  const optsIn = !!options && typeof options === "object" && !Array.isArray(options) && (
    ("hero" in options && options.hero === true) ||
    ("brand" in options && typeof options.brand === "string")
  );
  if (!optsIn) return null;
  const size = resolveWidgetSize(widget, bucket);
  return size === "1x1" ? null : size;
}

/** Parse "WxH" into column/row spans, clamped so width never exceeds the grid. */
export function spanForSize(size: WidgetSize, columns: number): { colSpan: number; rowSpan: number } {
  const [w, h] = size.split("x").map((n) => parseInt(n, 10));
  return { colSpan: Math.min(Math.max(1, w || 1), columns), rowSpan: Math.max(1, h || 1) };
}

/** Square unit size (px) so a 1×1 cell is ≈ square at the current width. */
export function squareUnit(width: number, m: GridMetrics): number {
  const usable = (width || 1024) - m.pad * 2 - m.gap * (m.columns - 1);
  return Math.max(96, Math.floor(usable / m.columns));
}

// ---------------------------------------------------------------------------
// Sections: a view's flat widget list is organised into domain "sections",
// each rendered by a self-contained `group` container (see `widgets/group.ts`).
// These functions are pure so the grouping is fully unit-testable.
// ---------------------------------------------------------------------------

/** Fixed render order of auto-collected sections. */
export const SECTION_ORDER: readonly SectionKind[] = SECTION_KINDS;

/** Human labels for each section heading (HA-native wording; edit freely). */
export const SECTION_LABELS: Record<SectionKind, string> = {
  media: "Media",
  devices: "Devices",
  sensors: "Sensors",
  energy: "Energy",
  // Hand-composed only (never auto-collected); heading comes from GroupOptions.
  tiles: "",
};

/** The section a widget type auto-collects into. */
export function sectionForWidgetType(type: WidgetType): SectionKind {
  const definition = widgetDefinition(type);
  if (definition) return definition.section;

  switch (type) {
    case "media":
      return "media";
    case "energy":
    case "powerflow":
    case "solarcharging":
    case "energychart":
      return "energy";
    case "sensor":
    case "binary_sensor":
    case "person":
    case "weather":
      return "sensors";
    default:
      // switch, fan, cover, lock, vacuum, camera, scene,
      // script, button, action, alarm — everything actionable.
      return "devices";
  }
}

/** The tile layout the frame should use for a container of the given variant. */
export function layoutForVariant(variant: SectionKind): "row" | "tile" | "value" {
  if (variant === "devices") return "tile";
  if (variant === "sensors") return "value";
  return "row"; // media / energy / tiles own their own bodies
}

/**
 * A container's internal column count, keyed to the container's OWN measured
 * width (so it reflows independently of the outer grid — identical tiles, more
 * columns as it gets wider).
 */
export function sectionColumns(variant: SectionKind, width: number): number {
  const w = width || 1024;
  switch (variant) {
    case "media":
      return w < 900 ? 1 : 2;
    case "devices":
      // The section is measured after the page's compact padding is applied.
      // Below 354px, three columns would leave each device tile too narrow for
      // its icon, accessory and two-line title, so narrow phones fall back to
      // two columns. A 390px viewport still has room for the intended three.
      return w < 354 ? 2 : w < 600 ? 3 : w < 900 ? 4 : w < 1200 ? 6 : 8;
    case "sensors":
      return w < 600 ? 2 : w < 900 ? 3 : w < 1200 ? 4 : 6;
    case "energy":
      // Energy widgets are wide (2×1 bars, 2×2 diagrams). Keep ≥2 columns so a
      // 2-wide widget fills the row without becoming a full-width square.
      return w < 900 ? 2 : 4;
    case "tiles":
      // Homey status tiles: two-up on a phone, one row across on a tablet.
      return w < 640 ? 2 : 3;
  }
}

const GROUP_SIZE: WidgetConfig["size"] = { compact: "4x2", medium: "4x2", wide: "4x2" };

function syntheticGroup(kind: SectionKind, children: WidgetConfig[]): WidgetConfig {
  const options: GroupOptions = { label: SECTION_LABELS[kind], variant: kind, children };
  return {
    id: `__section_${kind}`,
    type: "group",
    size: GROUP_SIZE,
    options: options as unknown as Record<string, unknown>,
  };
}

/**
 * Transform a view's flat widget list into the list of top-level renderables.
 *
 * Default (no explicit `group` in the view): widgets are auto-partitioned by
 * domain into synthetic `group` containers, emitted in `SECTION_ORDER`, with
 * configured order preserved WITHIN each section and empty sections omitted.
 *
 * Override: if the view already contains any explicit `group` widget, the list
 * is returned unchanged — the author is hand-composing sections, so we don't
 * re-collect. (Auto XOR manual, per view.)
 */
export function sectioniseView(widgets: WidgetConfig[]): WidgetConfig[] {
  const list = widgets ?? [];
  if (list.some((w) => w.type === "group")) return list;

  const buckets = new Map<SectionKind, WidgetConfig[]>();
  for (const w of list) {
    const kind = sectionForWidgetType(w.type);
    const bucket = buckets.get(kind) ?? [];
    bucket.push(w);
    buckets.set(kind, bucket);
  }

  const out: WidgetConfig[] = [];
  for (const kind of SECTION_ORDER) {
    const members = buckets.get(kind);
    if (members && members.length) out.push(syntheticGroup(kind, members));
  }
  return out;
}
