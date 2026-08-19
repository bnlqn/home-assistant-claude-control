import { describe, it, expect } from "vitest";
import { gridMetricsForWidth, resolveWidgetSize, spanForSize, squareUnit } from "./layout.js";
import type { WidgetConfig } from "../config/schema.js";

const widget: WidgetConfig = {
  id: "w",
  type: "light",
  entity: "light.a",
  size: { compact: "1x1", medium: "2x1", wide: "2x2" },
};

describe("responsive grid metrics", () => {
  it("chooses the right column count / bucket per width", () => {
    expect(gridMetricsForWidth(375)).toMatchObject({ columns: 2, bucket: "compact" });
    expect(gridMetricsForWidth(768)).toMatchObject({ columns: 4, bucket: "medium" });
    expect(gridMetricsForWidth(1000)).toMatchObject({ columns: 6, bucket: "wide" });
    expect(gridMetricsForWidth(1440)).toMatchObject({ columns: 8, bucket: "wide" });
    expect(gridMetricsForWidth(1920)).toMatchObject({ columns: 10, bucket: "wide" });
  });
});

describe("responsive size selection", () => {
  it("picks the footprint for the active breakpoint", () => {
    expect(resolveWidgetSize(widget, "compact")).toBe("1x1");
    expect(resolveWidgetSize(widget, "medium")).toBe("2x1");
    expect(resolveWidgetSize(widget, "wide")).toBe("2x2");
  });
});

describe("span parsing", () => {
  it("parses WxH into spans", () => {
    expect(spanForSize("2x2", 6)).toEqual({ colSpan: 2, rowSpan: 2 });
    expect(spanForSize("1x2", 6)).toEqual({ colSpan: 1, rowSpan: 2 });
  });
  it("never lets a widget be wider than the grid", () => {
    // A 2-wide widget in a 1-column grid clamps to 1.
    expect(spanForSize("2x1", 1).colSpan).toBe(1);
  });
});

describe("square unit", () => {
  it("keeps a 1×1 cell reasonably square and never below the floor", () => {
    const m = gridMetricsForWidth(390);
    const unit = squareUnit(390, m);
    expect(unit).toBeGreaterThanOrEqual(96);
    expect(unit).toBeLessThan(390);
  });
});
