import { describe, it, expect } from "vitest";
import {
  ENERGY_COLORS,
  nowMarkLine,
  resolveChartTheme,
  roundedTop,
  tooltipHtml,
  tooltipStyle,
  type ChartTheme,
} from "./chart-style.js";

const THEME: ChartTheme = {
  text: "#111",
  dim: "#888",
  grid: "rgba(0,0,0,0.08)",
  surface: "#fff",
  border: "rgba(0,0,0,0.08)",
  font: "system-ui",
  dark: false,
};

describe("roundedTop", () => {
  it("rounds only the outermost (top) segment of a stack", () => {
    const solar = [3, 0];
    const carAbove = [1, 0];
    // Solar with a non-empty segment above it at index 0 → not the top there.
    const solarStyle = roundedTop([carAbove])({ dataIndex: 0 }) as { borderRadius: number | number[] };
    expect(solarStyle.borderRadius).toBe(0);
    // At index 1 the segment above is 0 → solar IS the top → rounded.
    const solarTop = roundedTop([carAbove])({ dataIndex: 1 }) as { borderRadius: number[] };
    expect(solarTop.borderRadius).toEqual([6, 6, 0, 0]);
    // The topmost series (nothing above) is always rounded.
    expect((roundedTop([])({ dataIndex: 0 }) as { borderRadius: number[] }).borderRadius).toEqual([6, 6, 0, 0]);
    void solar;
  });
});

// GUARD: a tooltip must always surface the header AND every series value — the
// whole point of an interactive chart. If a value can be silently dropped, the
// chart is back to being a useless picture.
describe("tooltipHtml", () => {
  it("includes the header and every row's label and value", () => {
    const html = tooltipHtml(THEME, "1:00 PM – 2:00 PM", [
      { color: ENERGY_COLORS.solar.solid, label: "Solar", value: "4.5 kWh" },
      { color: ENERGY_COLORS.export.solid, label: "Export", value: "2.5 kWh" },
    ]);
    expect(html).toContain("1:00 PM – 2:00 PM");
    expect(html).toContain("Solar");
    expect(html).toContain("4.5 kWh");
    expect(html).toContain("Export");
    expect(html).toContain("2.5 kWh");
    // Every colored swatch is drawn.
    expect(html).toContain(ENERGY_COLORS.solar.solid);
    expect(html).toContain(ENERGY_COLORS.export.solid);
  });
});

describe("tooltipStyle", () => {
  it("returns a styled, non-empty tooltip container that adapts to theme", () => {
    const light = tooltipStyle({ ...THEME, dark: false });
    const dark = tooltipStyle({ ...THEME, dark: true });
    expect(light.backgroundColor).not.toBe(dark.backgroundColor);
    expect(light.extraCssText).toContain("border-radius");
    expect(light.textStyle.color).toBe(THEME.text);
  });
});

describe("nowMarkLine", () => {
  it("places one line at the given index and none when absent", () => {
    const present = nowMarkLine(THEME, 5) as { data: unknown[] };
    expect(present.data).toHaveLength(1);
    expect((present.data[0] as { xAxis: number }).xAxis).toBe(5);
    const absent = nowMarkLine(THEME, -1) as { data: unknown[] };
    expect(absent.data).toHaveLength(0);
  });
});

describe("resolveChartTheme", () => {
  it("resolves usable fallbacks (light) from a bare element", () => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    const theme = resolveChartTheme(el);
    expect(theme.dark).toBe(false);
    expect(theme.text).toBeTruthy();
    expect(theme.font).toBeTruthy();
    el.remove();
  });
});
