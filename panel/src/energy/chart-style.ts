import { graphic } from "../primitives/echart.js";

/** Theme-sensitive chart colors resolved from the panel's CSS design tokens. */
export interface ChartTheme {
  text: string;
  dim: string;
  grid: string;
  surface: string;
  border: string;
  font: string;
  dark: boolean;
}

const read = (cs: CSSStyleDeclaration, name: string, fallback: string): string =>
  cs.getPropertyValue(name).trim() || fallback;

/** Rough perceived-luminance test so charts adapt to a light or dark surface. */
function isDark(color: string): boolean {
  let r: number;
  let g: number;
  let b: number;
  const hex = color.startsWith("#") ? color.slice(1) : "";
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length >= 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    const m = color.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
    if (!m) return false;
    [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5;
}

/** Resolve chart theme from a host element so charts match the surrounding UI. */
export function resolveChartTheme(host: Element): ChartTheme {
  const cs = getComputedStyle(host);
  const dark = isDark(read(cs, "--canvas", "#f2f3f5"));
  return {
    text: read(cs, "--text-primary", "#1c1d21"),
    dim: read(cs, "--text-tertiary", "#9aa0a6"),
    grid: dark ? "rgba(255,255,255,0.09)" : "rgba(20,23,28,0.08)",
    surface: read(cs, "--surface", "#ffffff"),
    border: read(cs, "--border-subtle", "rgba(0,0,0,0.08)"),
    font: read(cs, "--font-sans", "system-ui, -apple-system, sans-serif"),
    dark,
  };
}

/** A soft vertical gradient (lighter at the top) for a bar/area fill. */
export function vGradient(top: string, bottom: string): unknown {
  return new graphic.LinearGradient(0, 0, 0, 1, [
    { offset: 0, color: top },
    { offset: 1, color: bottom },
  ]);
}

/** Refined series palette — vivid but soft, legible on light and dark surfaces. */
export const ENERGY_COLORS = {
  solar: { top: "#FFD27A", bottom: "#F5A623", solid: "#F5A623" },
  import: { top: "#7FB4FF", bottom: "#3B82F6", solid: "#3B82F6" },
  export: { top: "#C9B7FF", bottom: "#9B7CF0", solid: "#9B7CF0" },
  car: { top: "#7BE6D4", bottom: "#22B8A0", solid: "#22B8A0" },
} as const;

/**
 * An `itemStyle` callback that rounds only the *outermost* segment of a stack —
 * so a multi-series bar reads as one clean pill, not a stack of rounded blocks.
 * `above` are the value arrays of the series stacked on top of this one.
 */
export function roundedTop(above: number[][], r = 6): (params: { dataIndex: number }) => object {
  return (params) => {
    const i = params.dataIndex;
    const isTop = above.every((vals) => !(vals[i] > 0));
    return { borderRadius: isTop ? [r, r, 0, 0] : 0 };
  };
}

/** Tooltip container styling shared by every energy chart (Homey-style glass card). */
export function tooltipStyle(theme: ChartTheme): {
  backgroundColor: string;
  borderWidth: number;
  padding: number;
  extraCssText: string;
  textStyle: { color: string; fontFamily: string; fontSize: number };
} {
  return {
    backgroundColor: theme.dark ? "rgba(32,34,39,0.92)" : "rgba(255,255,255,0.94)",
    borderWidth: 0,
    padding: 0,
    extraCssText: `border-radius:14px;box-shadow:0 12px 34px rgba(0,0,0,${
      theme.dark ? 0.5 : 0.16
    });backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid ${theme.border};`,
    textStyle: { color: theme.text, fontFamily: theme.font, fontSize: 12 },
  };
}

/** Build the inner HTML for a tooltip: a bold header and colored value rows. */
export function tooltipHtml(
  theme: ChartTheme,
  header: string,
  rows: Array<{ color: string; label: string; value: string }>,
): string {
  const head = `<div style="font-weight:700;color:${theme.text};margin-bottom:6px;white-space:nowrap">${header}</div>`;
  const body = rows
    .map(
      (r) => `<div style="display:flex;align-items:center;gap:8px;line-height:1.7;white-space:nowrap">
        <span style="width:9px;height:9px;border-radius:3px;background:${r.color};flex:none"></span>
        <span style="color:${theme.dim}">${r.label}</span>
        <b style="margin-left:auto;padding-left:16px;color:${theme.text};font-variant-numeric:tabular-nums">${r.value}</b>
      </div>`,
    )
    .join("");
  return `<div style="padding:10px 12px;font-family:${theme.font};font-size:12px">${head}${body}</div>`;
}

/** A dashed "now" reference line placed at the given category index. */
export function nowMarkLine(theme: ChartTheme, index: number): object {
  return {
    silent: true,
    symbol: "none",
    animation: false,
    label: { show: false },
    lineStyle: { color: theme.dim, type: [5, 4], width: 1.5, opacity: 0.7 },
    data: index >= 0 ? [{ xAxis: index }] : [],
  };
}
