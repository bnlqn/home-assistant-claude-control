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

/** Complete grid rules selected by a shape-aware display profile. */
export interface GridMetrics {
  profile: DisplayProfile;
  columns: number;
  gap: number;
  pad: number;
  bucket: Breakpoint;
  minUnit: number;
  maxWidth: number;
}

export const DISPLAY_PROFILES = [
  "phonePortrait",
  "phoneLandscape",
  "tabletPortrait",
  "tabletLandscape",
  "desktop",
  "wall",
] as const;

export type DisplayProfile = typeof DISPLAY_PROFILES[number];

const PROFILE_METRICS: Readonly<Record<DisplayProfile, GridMetrics>> = {
  phonePortrait: { profile: "phonePortrait", columns: 2, gap: 10, pad: 12, bucket: "compact", minUnit: 96, maxWidth: 640 },
  phoneLandscape: { profile: "phoneLandscape", columns: 4, gap: 10, pad: 12, bucket: "compact", minUnit: 96, maxWidth: 900 },
  tabletPortrait: { profile: "tabletPortrait", columns: 4, gap: 14, pad: 20, bucket: "medium", minUnit: 104, maxWidth: 960 },
  tabletLandscape: { profile: "tabletLandscape", columns: 6, gap: 16, pad: 24, bucket: "wide", minUnit: 112, maxWidth: 1280 },
  desktop: { profile: "desktop", columns: 8, gap: 16, pad: 28, bucket: "wide", minUnit: 112, maxWidth: 1760 },
  wall: { profile: "wall", columns: 10, gap: 16, pad: 32, bucket: "wide", minUnit: 120, maxWidth: 1760 },
};

/** Resolve a named display profile from the panel's available shape. */
export function resolveDisplayProfile(width: number, height: number): DisplayProfile {
  const w = width || 1024;
  const h = height || 768;
  if (w >= 1800) return "wall";
  if (w >= 1200) return "desktop";
  if (w < 600) return w > h ? "phoneLandscape" : "phonePortrait";
  if (w < 900) return w > h ? "phoneLandscape" : "tabletPortrait";
  return w > h ? "tabletLandscape" : "tabletPortrait";
}

/** Grid rules for an already resolved display profile. */
export function gridMetricsForProfile(profile: DisplayProfile): GridMetrics {
  return PROFILE_METRICS[profile];
}

/** The widget footprint for the given breakpoint, with safe fallbacks. */
export function resolveWidgetSize(widget: WidgetConfig, bucket: Breakpoint): WidgetSize {
  return widget.size?.[bucket] ?? widget.size?.medium ?? "1x1";
}

/** Parse "WxH" into column/row spans, clamped so width never exceeds the grid. */
export function spanForSize(size: WidgetSize, columns: number): { colSpan: number; rowSpan: number } {
  const [w, h] = size.split("x").map((n) => parseInt(n, 10));
  return { colSpan: Math.min(Math.max(1, w || 1), columns), rowSpan: Math.max(1, h || 1) };
}

/** Square unit size (px) so a 1×1 cell is ≈ square at the current width. */
export function squareUnit(width: number, m: GridMetrics): number {
  const usable = (width || 1024) - m.pad * 2 - m.gap * (m.columns - 1);
  return Math.max(m.minUnit, Math.floor(usable / m.columns));
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
  return widgetDefinition(type).section;
}

/** The tile layout the frame should use for a container of the given variant. */
export function layoutForVariant(variant: SectionKind): "row" | "tile" | "value" {
  if (variant === "devices") return "tile";
  if (variant === "sensors") return "value";
  return "row"; // media / energy / tiles own their own bodies
}

export interface WidgetPlacement {
  profile: DisplayProfile;
  size: WidgetSize;
  columns: number;
  colSpan: number;
  rowSpan: number;
  layout: "row" | "tile" | "value";
}

/**
 * Resolve the complete placement contract passed to a widget. Configured
 * footprints remain authoritative in every section; only the active profile
 * chooses which declared footprint is used.
 */
export function resolveWidgetPlacement(
  widget: WidgetConfig,
  profile: DisplayProfile,
  columns: number,
  section?: SectionKind,
): WidgetPlacement {
  const size = resolveWidgetSize(widget, gridMetricsForProfile(profile).bucket);
  const { colSpan, rowSpan } = spanForSize(size, columns);
  return {
    profile,
    size,
    columns,
    colSpan,
    rowSpan,
    layout: section ? layoutForVariant(section) : "row",
  };
}

/**
 * Temporary section-grid column rules keyed to the shared display profile.
 * Phase 2's structural-section slice will fold these into the page grid.
 */
const SECTION_COLUMNS: Readonly<Record<SectionKind, Readonly<Record<DisplayProfile, number>>>> = {
  media: { phonePortrait: 1, phoneLandscape: 2, tabletPortrait: 2, tabletLandscape: 2, desktop: 2, wall: 2 },
  devices: { phonePortrait: 2, phoneLandscape: 4, tabletPortrait: 4, tabletLandscape: 6, desktop: 8, wall: 10 },
  sensors: { phonePortrait: 2, phoneLandscape: 4, tabletPortrait: 3, tabletLandscape: 4, desktop: 6, wall: 8 },
  energy: { phonePortrait: 2, phoneLandscape: 4, tabletPortrait: 4, tabletLandscape: 4, desktop: 4, wall: 6 },
  tiles: { phonePortrait: 2, phoneLandscape: 3, tabletPortrait: 3, tabletLandscape: 3, desktop: 3, wall: 3 },
};

export function sectionColumns(variant: SectionKind, profile: DisplayProfile): number {
  return SECTION_COLUMNS[variant][profile];
}

const GROUP_SIZE: WidgetConfig["size"] = { compact: "4x2", medium: "4x2", wide: "4x2" };

function syntheticGroup(kind: SectionKind, children: WidgetConfig[]): WidgetConfig {
  const options: GroupOptions = { label: SECTION_LABELS[kind], variant: kind, children };
  return {
    id: `__section_${kind}`,
    type: "group",
    size: GROUP_SIZE,
    options,
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
