import { describe, it, expect } from "vitest";
import {
  gridMetricsForProfile,
  layoutForVariant,
  resolveDisplayProfile,
  resolveWidgetSize,
  resolveWidgetPlacement,
  sectionColumns,
  sectionForWidgetType,
  sectioniseView,
  spanForSize,
  squareUnit,
} from "./layout.js";
import type { GroupOptions, WidgetConfig } from "../config/schema.js";

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
const opts = (group: WidgetConfig): GroupOptions => group.type === "group" ? group.options : {};

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

describe("section columns follow the shared display profile", () => {
  it("devices gain density intentionally across profiles", () => {
    expect(sectionColumns("devices", "phonePortrait")).toBe(2);
    expect(sectionColumns("devices", "phoneLandscape")).toBe(4);
    expect(sectionColumns("devices", "tabletPortrait")).toBe(4);
    expect(sectionColumns("devices", "tabletLandscape")).toBe(6);
    expect(sectionColumns("devices", "desktop")).toBe(8);
    expect(sectionColumns("devices", "wall")).toBe(10);
  });
  it("distinguishes phone landscape from tablet portrait", () => {
    expect(sectionColumns("sensors", "phonePortrait")).toBe(2);
    expect(sectionColumns("sensors", "phoneLandscape")).toBe(4);
    expect(sectionColumns("sensors", "tabletPortrait")).toBe(3);
    expect(sectionColumns("sensors", "tabletLandscape")).toBe(4);
  });
  it("media uses one phone-portrait column and two elsewhere", () => {
    expect(sectionColumns("media", "phonePortrait")).toBe(1);
    expect(sectionColumns("media", "phoneLandscape")).toBe(2);
    expect(sectionColumns("media", "desktop")).toBe(2);
  });
});

describe("sectioniseView", () => {
  it("auto-partitions a flat list into ordered, labelled sections", () => {
    const out = sectioniseView([
      w("s1", "sensor", "sensor.a"),
      w("l1", "light", "light.a"),
      w("m1", "media", "media_player.a"),
      w("l2", "switch", "switch.a"),
      w("p1", "powerflow"),
    ]);
    // Emitted in SECTION_ORDER: media, devices, sensors, energy.
    expect(out.map((g) => g.type)).toEqual(["group", "group", "group", "group"]);
    expect(out.map((g) => opts(g).variant)).toEqual(["media", "devices", "sensors", "energy"]);
    expect(out.map((g) => opts(g).label)).toEqual(["Media", "Devices", "Sensors", "Energy"]);
    // Order preserved within the devices bucket.
    expect(opts(out[1]).children!.map((c) => c.id)).toEqual(["l1", "l2"]);
  });

  it("omits empty sections", () => {
    const out = sectioniseView([w("s1", "sensor", "sensor.a"), w("s2", "sensor", "sensor.b")]);
    expect(out).toHaveLength(1);
    expect(opts(out[0]).variant).toBe("sensors");
  });

  it("passes a hand-composed view through untouched when it already has a group", () => {
    const manual: WidgetConfig[] = [
      { id: "g", type: "group", size: sz, options: { label: "Mine", variant: "devices", children: [w("l1", "light", "light.a")] } },
      w("s1", "sensor", "sensor.a"),
    ];
    const out = sectioniseView(manual);
    expect(out).toBe(manual);
  });
});
