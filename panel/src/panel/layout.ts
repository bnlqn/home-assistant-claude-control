import type { Breakpoint, WidgetConfig, WidgetSize } from "../config/schema.js";

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
