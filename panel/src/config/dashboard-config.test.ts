import { describe, it, expect } from "vitest";
import { dashboardConfig } from "./dashboard.config.js";
import {
  dashboardConfigToDocument,
  dashboardDocumentToConfig,
  validateDashboardDocument,
} from "./dashboard-document.js";
import { DISPLAY_PROFILES } from "./schema.js";
import { validateConfig } from "./validation.js";

describe("shipped dashboard.config", () => {
  it("passes validation with zero errors", () => {
    const r = validateConfig(dashboardConfig);
    const errors = r.issues.filter((i) => i.level === "error");
    if (errors.length) console.error(errors);
    expect(errors).toHaveLength(0);
    expect(r.ok).toBe(true);
  });

  it("has a resolvable defaultView", () => {
    const ids = dashboardConfig.views.map((v) => v.id);
    expect(ids).toContain(dashboardConfig.defaultView);
  });

  it("gives every room its own view (no room is a widget)", () => {
    const rooms = dashboardConfig.views.filter((v) => v.type === "room");
    expect(rooms.length).toBeGreaterThan(3);
    // No widget type may represent a whole room.
    const widgetTypes = dashboardConfig.views.flatMap((v) => v.widgets.map((w) => w.type));
    expect(widgetTypes).not.toContain("room");
  });

  it("uses only unique widget ids across the whole dashboard", () => {
    const ids = dashboardConfig.views.flatMap((v) => v.widgets.map((w) => w.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("adapts and resolves every display profile without errors", () => {
    const document = dashboardConfigToDocument(dashboardConfig);
    const documentResult = validateDashboardDocument(document);
    expect(documentResult.issues.filter((issue) => issue.level === "error")).toEqual([]);

    for (const profile of DISPLAY_PROFILES) {
      const runtime = dashboardDocumentToConfig(document, profile);
      const result = validateConfig(runtime);
      expect(result.issues.filter((issue) => issue.level === "error"), profile).toEqual([]);
      expect(runtime.views.map((view) => view.id)).toEqual(
        dashboardConfig.views.map((view) => view.id),
      );
    }
  });
});
