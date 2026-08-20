import { describe, expect, it } from "vitest";
import { panelAssetUrl } from "./assets.js";

describe("panelAssetUrl", () => {
  it("serves Vite public assets from the root in development", () => {
    expect(panelAssetUrl("assets/energy-house.webp", true)).toBe("/assets/energy-house.webp");
  });

  it("serves deployed assets beside the panel module in Home Assistant", () => {
    expect(panelAssetUrl("/assets/energy-house.webp", false)).toBe(
      "/local/home-dashboard/assets/energy-house.webp",
    );
  });
});
