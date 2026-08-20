import { describe, it, expect } from "vitest";
import { validateConfig, isPlaceholderEntity } from "./validation.js";
import type { DashboardConfig } from "./schema.js";

const okConfig: DashboardConfig = {
  defaultView: "overview",
  views: [
    {
      id: "overview",
      type: "overview",
      label: "Home",
      icon: "mdi:home",
      widgets: [
        { id: "w1", type: "light", entity: "light.a", size: { compact: "1x1", medium: "1x1", wide: "1x1" } },
      ],
    },
    {
      id: "room1",
      type: "room",
      label: "Room",
      icon: "mdi:sofa",
      widgets: [
        { id: "w2", type: "climate", entity: "climate.a", size: { compact: "2x1", medium: "2x2", wide: "2x2" } },
      ],
    },
  ],
};

describe("validateConfig", () => {
  it("accepts a valid config", () => {
    const r = validateConfig(okConfig);
    expect(r.ok).toBe(true);
    expect(r.issues.filter((i) => i.level === "error")).toHaveLength(0);
    expect(r.sanitized.views).toHaveLength(2);
  });

  it("rejects an unknown widget type and drops the widget", () => {
    const bad = structuredClone(okConfig);
    // @ts-expect-error intentionally invalid
    bad.views[0].widgets[0].type = "nonsense";
    const r = validateConfig(bad);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.message.includes("Unknown widget type"))).toBe(true);
    // sanitized view has the bad widget removed
    expect(r.sanitized.views[0].widgets).toHaveLength(0);
  });

  it("rejects a size a widget type does not support", () => {
    const bad = structuredClone(okConfig);
    // switch does not support 2x2
    bad.views[0].widgets[0] = {
      id: "w1",
      type: "switch",
      entity: "switch.a",
      size: { compact: "2x2", medium: "2x2", wide: "2x2" },
    };
    const r = validateConfig(bad);
    expect(r.ok).toBe(false);
    expect(r.issues.some((i) => i.message.includes('does not support size "2x2"'))).toBe(true);
  });

  it("flags duplicate widget ids", () => {
    const bad = structuredClone(okConfig);
    bad.views[1].widgets[0].id = "w1"; // duplicate of overview widget
    const r = validateConfig(bad);
    expect(r.issues.some((i) => i.message.includes("Duplicate widget id"))).toBe(true);
  });

  it("flags duplicate view ids", () => {
    const bad = structuredClone(okConfig);
    bad.views[1].id = "overview";
    const r = validateConfig(bad);
    expect(r.issues.some((i) => i.message.includes("Duplicate view id"))).toBe(true);
  });

  it("requires an entity for entity-backed widgets", () => {
    const bad = structuredClone(okConfig);
    delete bad.views[0].widgets[0].entity;
    const r = validateConfig(bad);
    expect(r.issues.some((i) => i.message.includes("requires an `entity`"))).toBe(true);
  });

  it("does not require an entity for composite types (energy/action)", () => {
    const cfg: DashboardConfig = {
      defaultView: "overview",
      views: [
        {
          id: "overview",
          type: "overview",
          label: "Home",
          icon: "mdi:home",
          widgets: [{ id: "e", type: "energy", size: { compact: "2x1", medium: "2x2", wide: "2x2" } }],
        },
      ],
    };
    const r = validateConfig(cfg);
    expect(r.ok).toBe(true);
  });

  it("flags a malformed entity id", () => {
    const bad = structuredClone(okConfig);
    bad.views[0].widgets[0].entity = "not-an-entity";
    const r = validateConfig(bad);
    expect(r.issues.some((i) => i.message.includes("not a valid entity_id"))).toBe(true);
  });

  it("validates children of an explicit group container", () => {
    const cfg: DashboardConfig = {
      defaultView: "overview",
      views: [
        {
          id: "overview",
          type: "overview",
          label: "Home",
          icon: "mdi:home",
          widgets: [
            {
              id: "g",
              type: "group",
              size: { compact: "4x2", medium: "4x2", wide: "4x2" },
              options: {
                label: "Devices",
                variant: "devices",
                children: [
                  // Missing entity → should surface a nested error.
                  { id: "c1", type: "light", size: { compact: "1x1", medium: "1x1", wide: "1x1" } },
                ],
              },
            },
          ],
        },
      ],
    };
    const r = validateConfig(cfg);
    expect(r.issues.some((i) => i.path.includes("options.children[0]") && i.message.includes("requires an `entity`"))).toBe(true);
  });

  it("requires a group to have a non-empty children array", () => {
    const cfg: DashboardConfig = {
      defaultView: "overview",
      views: [
        {
          id: "overview",
          type: "overview",
          label: "Home",
          icon: "mdi:home",
          widgets: [
            { id: "g", type: "group", size: { compact: "4x2", medium: "4x2", wide: "4x2" }, options: { label: "Empty" } },
          ],
        },
      ],
    };
    const r = validateConfig(cfg);
    expect(r.issues.some((i) => i.message.includes("non-empty `children`"))).toBe(true);
  });

  it("errors when defaultView matches no view", () => {
    const bad = structuredClone(okConfig);
    bad.views = [];
    bad.defaultView = "ghost";
    const r = validateConfig(bad);
    expect(r.ok).toBe(false);
  });

  it("falls back defaultView to first view with a warning", () => {
    const cfg = structuredClone(okConfig);
    cfg.defaultView = "missing";
    const r = validateConfig(cfg);
    expect(r.sanitized.defaultView).toBe("overview");
    expect(r.issues.some((i) => i.level === "warning")).toBe(true);
  });
});

describe("isPlaceholderEntity", () => {
  it("detects REPLACE_ME placeholders", () => {
    expect(isPlaceholderEntity("light.REPLACE_ME_LIVING")).toBe(true);
    expect(isPlaceholderEntity("light.living_room")).toBe(false);
    expect(isPlaceholderEntity(undefined)).toBe(false);
  });
});
