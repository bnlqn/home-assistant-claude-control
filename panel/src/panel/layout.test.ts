import { describe, it, expect } from "vitest";
import {
  DISPLAY_PROFILES,
  gridMetricsForProfile,
  layoutForVariant,
  packViewGrid,
  resolveDisplayProfile,
  resolveWidgetSize,
  resolveWidgetPlacement,
  sectionForWidgetType,
  structureView,
  spanForSize,
  squareUnit,
} from "./layout.js";
import type { WidgetConfig } from "../config/schema.js";

const widget: WidgetConfig = {
  id: "w",
  type: "light",
  entity: "light.a",
  size: { compact: "1x1", medium: "2x1", wide: "2x2" },
};

const sz: WidgetConfig["size"] = { compact: "1x1", medium: "1x1", wide: "1x1" };
const w = (id: string, type: WidgetConfig["type"], entity?: string): WidgetConfig => ({
  id,
  type,
  ...(entity ? { entity } : {}),
  size: sz,
}) as WidgetConfig;

describe("display profiles", () => {
  it("resolves the full supported viewport matrix from shape", () => {
    expect(resolveDisplayProfile(320, 568)).toBe("phonePortrait");
    expect(resolveDisplayProfile(390, 844)).toBe("phonePortrait");
    expect(resolveDisplayProfile(844, 390)).toBe("phoneLandscape");
    expect(resolveDisplayProfile(768, 1024)).toBe("tabletPortrait");
    expect(resolveDisplayProfile(1024, 768)).toBe("tabletLandscape");
    expect(resolveDisplayProfile(1440, 900)).toBe("desktop");
    expect(resolveDisplayProfile(1920, 1080)).toBe("wall");
  });

  it("defines intentional grid density per profile", () => {
    expect(gridMetricsForProfile("phonePortrait")).toMatchObject({ columns: 2, bucket: "compact" });
    expect(gridMetricsForProfile("phoneLandscape")).toMatchObject({ columns: 4, bucket: "compact" });
    expect(gridMetricsForProfile("tabletPortrait")).toMatchObject({ columns: 4, bucket: "medium" });
    expect(gridMetricsForProfile("tabletLandscape")).toMatchObject({ columns: 6, bucket: "wide" });
    expect(gridMetricsForProfile("desktop")).toMatchObject({ columns: 8, bucket: "wide" });
    expect(gridMetricsForProfile("wall")).toMatchObject({ columns: 10, bucket: "wide" });
  });
});

describe("responsive size selection", () => {
  it("picks the footprint for the active breakpoint", () => {
    expect(resolveWidgetSize(widget, "compact")).toBe("1x1");
    expect(resolveWidgetSize(widget, "medium")).toBe("2x1");
    expect(resolveWidgetSize(widget, "wide")).toBe("2x2");
  });
});

describe("shared widget placement", () => {
  it("keeps configured footprints authoritative across section variants", () => {
    const placement = resolveWidgetPlacement(widget, "tabletLandscape", 6, "devices");
    expect(placement).toMatchObject({
      profile: "tabletLandscape",
      size: "2x2",
      colSpan: 2,
      rowSpan: 2,
      layout: "tile",
    });
  });

  it("clamps a declared footprint only when the active grid is narrower", () => {
    const placement = resolveWidgetPlacement(widget, "desktop", 1);
    expect(placement).toMatchObject({ size: "2x2", colSpan: 1, rowSpan: 2, layout: "row" });
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
    const m = gridMetricsForProfile("phonePortrait");
    const unit = squareUnit(390, m);
    expect(unit).toBeGreaterThanOrEqual(96);
    expect(unit).toBeLessThan(390);
  });
});

describe("section classification", () => {
  it("maps widget types to their domain section", () => {
    expect(sectionForWidgetType("media")).toBe("media");
    expect(sectionForWidgetType("light")).toBe("devices");
    expect(sectionForWidgetType("climate")).toBe("devices");
    expect(sectionForWidgetType("lock")).toBe("devices");
    expect(sectionForWidgetType("sensor")).toBe("sensors");
    expect(sectionForWidgetType("person")).toBe("sensors");
    expect(sectionForWidgetType("weather")).toBe("sensors");
    expect(sectionForWidgetType("powerflow")).toBe("energy");
    expect(sectionForWidgetType("energychart")).toBe("energy");
  });

  it("picks the tile layout per variant", () => {
    expect(layoutForVariant("devices")).toBe("tile");
    expect(layoutForVariant("sensors")).toBe("value");
    expect(layoutForVariant("media")).toBe("row");
    expect(layoutForVariant("energy")).toBe("row");
  });
});

describe("structural sections", () => {
  it("partitions a flat list into ordered, labelled structures", () => {
    const out = structureView([
      w("s1", "sensor", "sensor.a"),
      w("l1", "light", "light.a"),
      w("m1", "media", "media_player.a"),
      w("l2", "switch", "switch.a"),
      w("p1", "powerflow"),
    ]);
    expect(out.map((section) => section.kind)).toEqual(["media", "devices", "sensors", "energy"]);
    expect(out.map((section) => section.label)).toEqual(["Media", "Devices", "Sensors", "Energy"]);
    expect(out[1].widgets.map((child) => child.id)).toEqual(["l1", "l2"]);
  });

  it("omits empty sections", () => {
    const out = structureView([w("s1", "sensor", "sensor.a"), w("s2", "sensor", "sensor.b")]);
    expect(out).toHaveLength(1);
    expect(out[0].kind).toBe("sensors");
  });
});

describe("deterministic page-grid packing", () => {
  it("packs mixed footprints without backfilling ahead of DOM order", () => {
    const widgets: WidgetConfig[] = [
      { ...w("large", "light", "light.large"), size: { compact: "2x2", medium: "2x2", wide: "2x2" } },
      w("small-a", "switch", "switch.a"),
      w("small-b", "switch", "switch.b"),
      { ...w("wide", "light", "light.wide"), size: { compact: "2x1", medium: "2x1", wide: "2x1" } },
    ];
    const packed = packViewGrid(widgets, "phoneLandscape");
    const cells = packed.items.filter((item) => item.kind === "widget");

    expect(packed.columns).toBe(4);
    expect(packed.rows).toEqual(["auto", "var(--unit)", "var(--unit)"]);
    expect(packed.items.map((item) => item.id)).toEqual([
      "section-devices-heading",
      "large",
      "small-a",
      "small-b",
      "wide",
    ]);
    expect(cells.map(({ id, columnStart, rowStart }) => ({ id, columnStart, rowStart }))).toEqual([
      { id: "large", columnStart: 1, rowStart: 2 },
      { id: "small-a", columnStart: 3, rowStart: 2 },
      { id: "small-b", columnStart: 4, rowStart: 2 },
      { id: "wide", columnStart: 3, rowStart: 3 },
    ]);
  });

  it("starts each structural section on new tracks and can suppress a page-redundant heading", () => {
    const widgets = [
      w("device", "light", "light.a"),
      w("sensor", "sensor", "sensor.a"),
      w("energy", "powerflow"),
    ];
    const packed = packViewGrid(widgets, "phonePortrait", ["energy"]);

    expect(packed.items.filter((item) => item.kind === "heading").map((item) => item.section)).toEqual([
      "devices",
      "sensors",
    ]);
    expect(packed.items.map((item) => item.id)).toEqual([
      "section-devices-heading",
      "device",
      "section-sensors-heading",
      "sensor",
      "energy",
    ]);
  });

  it("keeps every mixed-footprint cell in bounds and collision-free across profiles", () => {
    const widgets: WidgetConfig[] = [
      { ...w("climate", "climate", "climate.a"), size: { compact: "2x2", medium: "2x2", wide: "2x2" } },
      { ...w("light", "light", "light.a"), size: { compact: "2x1", medium: "2x1", wide: "2x1" } },
      w("switch", "switch", "switch.a"),
      { ...w("weather", "weather", "weather.a"), size: { compact: "2x1", medium: "1x2", wide: "2x2" } },
    ];

    for (const profile of DISPLAY_PROFILES) {
      const packed = packViewGrid(widgets, profile);
      const occupied = new Set<string>();
      for (const item of packed.items) {
        if (item.kind !== "widget") continue;
        expect(item.columnStart).toBeGreaterThanOrEqual(1);
        expect(item.columnStart + item.placement.colSpan - 1).toBeLessThanOrEqual(packed.columns);
        for (let row = item.rowStart; row < item.rowStart + item.placement.rowSpan; row += 1) {
          for (let column = item.columnStart; column < item.columnStart + item.placement.colSpan; column += 1) {
            const cell = `${row}:${column}`;
            expect(occupied.has(cell)).toBe(false);
            occupied.add(cell);
          }
        }
      }
    }
  });

  it("preserves a climate widget's 2×2 footprint in the shared tablet grid", () => {
    const climate: WidgetConfig = {
      id: "climate",
      type: "climate",
      entity: "climate.office",
      size: { compact: "2x2", medium: "2x2", wide: "2x2" },
    };
    const packed = packViewGrid([climate], "tabletLandscape");
    const cell = packed.items.find((item) => item.kind === "widget");

    expect(cell?.kind).toBe("widget");
    if (cell?.kind === "widget") {
      expect(cell.placement).toMatchObject({ size: "2x2", colSpan: 2, rowSpan: 2 });
    }
  });
});
