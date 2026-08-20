import { describe, expect, it } from "vitest";
import type { DashboardConfig } from "./schema.js";
import {
  dashboardConfigToDocument,
  dashboardDocumentToConfig,
  exportDashboardDocument,
  importDashboardDocument,
  loadDashboardDocument,
  migrateDashboardDocument,
  validateDashboardDocument,
} from "./dashboard-document.js";

const legacyConfig: DashboardConfig = {
  defaultView: "home",
  title: "My home",
  kiosk: {
    enabled: true,
    hideHomeAssistantSidebar: false,
    preventScreenSelection: true,
  },
  views: [
    {
      id: "home",
      type: "overview",
      label: "Home",
      icon: "mdi:home",
      widgets: [
        {
          id: "main-light",
          type: "light",
          entity: "light.main",
          name: "Main light",
          size: { compact: "1x1", medium: "2x1", wide: "2x2" },
        },
        {
          id: "scene-evening",
          type: "scene",
          entity: "scene.evening",
          size: { compact: "1x1", medium: "1x1", wide: "2x1" },
          requiresConfirmation: true,
        },
        {
          id: "all-lights-off",
          type: "action",
          size: { compact: "1x1", medium: "1x1", wide: "2x1" },
          options: {
            service: "light.turn_off",
            target: { entity_id: "light.all_lights" },
          },
        },
      ],
    },
    {
      id: "energy",
      type: "system",
      label: "Energy",
      icon: "mdi:lightning-bolt",
      hero: {
        type: "energy",
        grid: "sensor.grid_energy_today",
        solar: "sensor.solar_energy_today",
        gridPower: "sensor.grid_power",
        solarPower: "sensor.solar_power",
      },
      widgets: [],
    },
  ],
};

describe("dashboard document v1", () => {
  it("separates stable widget instances from per-profile placement", () => {
    const document = dashboardConfigToDocument(legacyConfig);

    expect(document.version).toBe(1);
    expect(document.defaultPageId).toBe("home");
    expect(document.widgets[0]).toEqual({
      id: "main-light",
      type: "light",
      entity: "light.main",
      name: "Main light",
    });
    expect(document.widgets[0]).not.toHaveProperty("size");
    expect(document.pages[0].placements.phonePortrait[0].size).toBe("1x1");
    expect(document.pages[0].placements.tabletPortrait[0].size).toBe("2x1");
    expect(document.pages[0].placements.desktop[0].size).toBe("2x2");
  });

  it("resolves order, visibility, and size from only the active profile", () => {
    const document = dashboardConfigToDocument(legacyConfig);
    document.pages[0].placements.phonePortrait = [
      { widgetId: "scene-evening", order: 0, size: "1x1", visible: true },
      { widgetId: "main-light", order: 1, size: "2x1", visible: true },
    ];
    document.pages[0].placements.desktop = [
      { widgetId: "main-light", order: 0, size: "2x2", visible: false },
      { widgetId: "scene-evening", order: 1, size: "2x1", visible: true },
    ];

    const phone = dashboardDocumentToConfig(document, "phonePortrait");
    const desktop = dashboardDocumentToConfig(document, "desktop");

    expect(phone.views[0].widgets.map((widget) => widget.id)).toEqual([
      "scene-evening",
      "main-light",
    ]);
    expect(phone.views[0].widgets[1].size).toEqual({
      compact: "2x1",
      medium: "2x1",
      wide: "2x1",
    });
    expect(desktop.views[0].widgets.map((widget) => widget.id)).toEqual(["scene-evening"]);
    expect(desktop.views[0].widgets[0].requiresConfirmation).toBe(true);
  });

  it("round-trips through human-readable JSON without losing data", () => {
    const fallback = dashboardConfigToDocument(legacyConfig);
    const serialized = exportDashboardDocument(fallback);
    const loaded = importDashboardDocument(serialized, fallback);

    expect(serialized).toContain('"version": 1');
    expect(loaded.usedFallback).toBe(false);
    expect(loaded.document).toEqual(fallback);
    expect(loaded.document.widgets[2]).toEqual(expect.objectContaining({
      options: {
        service: "light.turn_off",
        target: { entity_id: "light.all_lights" },
      },
    }));
  });

  it("migrates the legacy monolithic config as implicit version zero", () => {
    const migrated = migrateDashboardDocument(legacyConfig);

    expect(migrated).toEqual(dashboardConfigToDocument(legacyConfig));
    expect(validateDashboardDocument(migrated).ok).toBe(true);
  });

  it("rejects placement data embedded in a widget instance", () => {
    const document = dashboardConfigToDocument(legacyConfig) as unknown as {
      widgets: Array<Record<string, unknown>>;
    };
    document.widgets[0].size = { compact: "1x1", medium: "1x1", wide: "1x1" };

    const result = validateDashboardDocument(document);

    expect(result.ok).toBe(false);
    expect(result.issues).toContainEqual(expect.objectContaining({
      path: "widgets[0].size",
    }));
  });

  it("rejects missing profiles, unknown references, and unsupported sizes", () => {
    const document = dashboardConfigToDocument(legacyConfig) as unknown as {
      pages: Array<{ placements: Record<string, unknown[]> }>;
    };
    delete document.pages[0].placements.wall;
    document.pages[0].placements.desktop = [
      { widgetId: "missing", order: 0, size: "1x1", visible: true },
      { widgetId: "scene-evening", order: 1, size: "3x3", visible: true },
    ];

    const result = validateDashboardDocument(document);

    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.path.endsWith("placements.wall"))).toBe(true);
    expect(result.issues.some((issue) => issue.message.includes("unknown widget"))).toBe(true);
    expect(result.issues.some((issue) => issue.message.includes("does not support size"))).toBe(true);
  });

  it("keeps the known-good dashboard when imported data is corrupt", () => {
    const fallback = dashboardConfigToDocument(legacyConfig);
    const malformedJson = loadDashboardDocument("{ not json", fallback);
    const invalidReference = structuredClone(fallback);
    invalidReference.pages[0].placements.phonePortrait[0].widgetId = "missing";
    const invalidDocument = loadDashboardDocument(invalidReference, fallback);

    expect(malformedJson.usedFallback).toBe(true);
    expect(malformedJson.document).toEqual(fallback);
    expect(malformedJson.issues[0].path).toBe("document");
    expect(invalidDocument.usedFallback).toBe(true);
    expect(invalidDocument.document).toEqual(fallback);
    expect(invalidDocument.issues.some((issue) => issue.message.includes("unknown widget"))).toBe(true);
  });
});
