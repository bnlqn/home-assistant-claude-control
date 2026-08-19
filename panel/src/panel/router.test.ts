import { describe, it, expect } from "vitest";
import { pathForView, viewIdFromPath, viewIdFromRoute } from "./router.js";

describe("router", () => {
  it("derives the view id from a full pathname under the panel base", () => {
    expect(viewIdFromPath("/home-dashboard/living-room", "home-dashboard")).toBe("living-room");
    expect(viewIdFromPath("/home-dashboard", "home-dashboard")).toBe("");
    expect(viewIdFromPath("/home-dashboard/", "home-dashboard")).toBe("");
  });

  it("prefers Home Assistant's route.path when provided", () => {
    expect(viewIdFromRoute({ prefix: "/home-dashboard", path: "/kitchen" }, "home-dashboard")).toBe("kitchen");
    expect(viewIdFromRoute({ prefix: "/home-dashboard", path: "" }, "home-dashboard")).toBe("");
  });

  it("builds the path for a view, collapsing the default to the base", () => {
    expect(pathForView("home-dashboard", "kitchen", "overview")).toBe("/home-dashboard/kitchen");
    expect(pathForView("home-dashboard", "overview", "overview")).toBe("/home-dashboard");
    expect(pathForView("home-dashboard", "", "overview")).toBe("/home-dashboard");
  });
});
