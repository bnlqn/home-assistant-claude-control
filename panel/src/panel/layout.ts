import type {
  Breakpoint,
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
// Sections and packing: a flat widget list becomes structural headings plus
// explicitly positioned cells in one page grid. These functions stay pure so
// placement is deterministic and fully unit-testable.
// ---------------------------------------------------------------------------

/** Fixed render order of auto-collected sections. */
export const SECTION_ORDER: readonly SectionKind[] = SECTION_KINDS;

/** Human labels for each section heading (HA-native wording; edit freely). */
export const SECTION_LABELS: Record<SectionKind, string> = {
  media: "Media",
  devices: "Devices",
  sensors: "Sensors",
  energy: "Energy",
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

export interface ViewSection {
  id: string;
  kind: SectionKind;
  label: string;
  widgets: WidgetConfig[];
}

/** Partition a flat widget collection into ordered structural page sections. */
export function structureView(widgets: WidgetConfig[]): ViewSection[] {
  const buckets = new Map<SectionKind, WidgetConfig[]>();
  for (const w of widgets ?? []) {
    const kind = sectionForWidgetType(w.type);
    const bucket = buckets.get(kind) ?? [];
    bucket.push(w);
    buckets.set(kind, bucket);
  }

  return SECTION_ORDER.flatMap((kind) => {
    const members = buckets.get(kind);
    return members?.length
      ? [{ id: `section-${kind}`, kind, label: SECTION_LABELS[kind], widgets: members }]
      : [];
  });
}

export interface PackedHeading {
  kind: "heading";
  id: string;
  label: string;
  section: SectionKind;
  rowStart: number;
}

export interface PackedWidget {
  kind: "widget";
  id: string;
  widget: WidgetConfig;
  section: SectionKind;
  placement: WidgetPlacement;
  columnStart: number;
  rowStart: number;
}

export type PackedGridItem = PackedHeading | PackedWidget;

export interface PackedGrid {
  columns: number;
  rows: readonly string[];
  items: readonly PackedGridItem[];
}

/**
 * Deterministically pack structural sections into one page grid. Placement is
 * row-ordered and never backfills an earlier hole, keeping DOM, reading, and
 * keyboard order aligned while still respecting multi-row footprints.
 */
export function packViewGrid(
  widgets: WidgetConfig[],
  profile: DisplayProfile,
  hiddenHeadings: readonly SectionKind[] = [],
): PackedGrid {
  const columns = gridMetricsForProfile(profile).columns;
  const rows: string[] = [];
  const items: PackedGridItem[] = [];

  for (const section of structureView(widgets)) {
    if (section.label && !hiddenHeadings.includes(section.kind)) {
      rows.push("auto");
      items.push({
        kind: "heading",
        id: `${section.id}-heading`,
        label: section.label,
        section: section.kind,
        rowStart: rows.length,
      });
    }

    const baseRow = rows.length + 1;
    const occupied = new Set<string>();
    let cursorRow = 0;
    let cursorColumn = 0;
    let sectionRows = 0;

    for (const widget of section.widgets) {
      const placement = resolveWidgetPlacement(widget, profile, columns, section.kind);
      let placed = false;
      while (!placed) {
        if (cursorColumn + placement.colSpan > columns) {
          cursorRow += 1;
          cursorColumn = 0;
        }
        placed = rectangleAvailable(
          occupied,
          cursorRow,
          cursorColumn,
          placement.rowSpan,
          placement.colSpan,
        );
        if (!placed) cursorColumn += 1;
      }

      occupyRectangle(
        occupied,
        cursorRow,
        cursorColumn,
        placement.rowSpan,
        placement.colSpan,
      );
      items.push({
        kind: "widget",
        id: widget.id,
        widget,
        section: section.kind,
        placement,
        columnStart: cursorColumn + 1,
        rowStart: baseRow + cursorRow,
      });
      sectionRows = Math.max(sectionRows, cursorRow + placement.rowSpan);
      cursorColumn += placement.colSpan;
      if (cursorColumn >= columns) {
        cursorRow += 1;
        cursorColumn = 0;
      }
    }

    rows.push(...Array.from({ length: sectionRows }, () => "var(--unit)"));
  }

  return { columns, rows, items };
}

function rectangleAvailable(
  occupied: ReadonlySet<string>,
  row: number,
  column: number,
  rowSpan: number,
  colSpan: number,
): boolean {
  for (let y = row; y < row + rowSpan; y += 1) {
    for (let x = column; x < column + colSpan; x += 1) {
      if (occupied.has(`${y}:${x}`)) return false;
    }
  }
  return true;
}

function occupyRectangle(
  occupied: Set<string>,
  row: number,
  column: number,
  rowSpan: number,
  colSpan: number,
): void {
  for (let y = row; y < row + rowSpan; y += 1) {
    for (let x = column; x < column + colSpan; x += 1) {
      occupied.add(`${y}:${x}`);
    }
  }
}
