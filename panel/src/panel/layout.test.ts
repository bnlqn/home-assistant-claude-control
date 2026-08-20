import { describe, it, expect } from "vitest";
import {
  breakoutSizeFor,
  gridMetricsForWidth,
  layoutForVariant,
  resolveWidgetSize,
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
const opts = (g: WidgetConfig): GroupOptions => g.options as unknown as GroupOptions;

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

describe("hero break-out from uniform tile grids", () => {
  const branded: WidgetConfig = {
    id: "v",
    type: "vacuum",
    entity: "vacuum.x",
    size: { compact: "1x1", medium: "2x2", wide: "2x2" },
    options: { brand: "roborock" },
  };
  it("breaks a branded widget out to its footprint above 1×1", () => {
    expect(breakoutSizeFor(branded, "medium")).toBe("2x2");
    expect(breakoutSizeFor(branded, "wide")).toBe("2x2");
  });
  it("stays a plain tile at 1×1 (narrow) and when not opted in", () => {
    expect(breakoutSizeFor(branded, "compact")).toBeNull();
    expect(breakoutSizeFor(widget, "wide")).toBeNull(); // no brand/hero flag
  });
  it("also honors an explicit options.hero flag", () => {
    const hero: WidgetConfig = { ...branded, options: { hero: true } };
    expect(breakoutSizeFor(hero, "wide")).toBe("2x2");
  });
  it("preserves typed solar-charging brand breakouts", () => {
    const tesla: WidgetConfig = {
      id: "solar-charge",
      type: "solarcharging",
      size: { compact: "1x1", medium: "2x2", wide: "2x2" },
      options: { brand: "tesla", master: "input_boolean.solar_charging" },
    };
    expect(breakoutSizeFor(tesla, "compact")).toBeNull();
    expect(breakoutSizeFor(tesla, "medium")).toBe("2x2");
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

describe("section columns reflow to the container's own width", () => {
  it("devices go 2 → 3 → 4 → 6 → 8 without cramped narrow-phone cells", () => {
    expect(sectionColumns("devices", 320)).toBe(2);
    expect(sectionColumns("devices", 353)).toBe(2);
    expect(sectionColumns("devices", 354)).toBe(3);
    expect(sectionColumns("devices", 375)).toBe(3);
    expect(sectionColumns("devices", 768)).toBe(4);
    expect(sectionColumns("devices", 1100)).toBe(6);
    expect(sectionColumns("devices", 1600)).toBe(8);
  });
  it("sensors go 2 → 3 → 4 → 6", () => {
    expect(sectionColumns("sensors", 375)).toBe(2);
    expect(sectionColumns("sensors", 768)).toBe(3);
    expect(sectionColumns("sensors", 1100)).toBe(4);
    expect(sectionColumns("sensors", 1600)).toBe(6);
  });
  it("media is a single hero column on a phone, two when wide", () => {
    expect(sectionColumns("media", 375)).toBe(1);
    expect(sectionColumns("media", 1200)).toBe(2);
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
      { id: "g", type: "group", size: sz, options: { label: "Mine", variant: "devices", children: [w("l1", "light", "light.a")] } as unknown as Record<string, unknown> },
      w("s1", "sensor", "sensor.a"),
    ];
    const out = sectioniseView(manual);
    expect(out).toBe(manual);
  });
});
