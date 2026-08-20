import { describe, it, expect } from "vitest";
import { appIcon, isAppLauncher, splitFeaturedApps } from "./media-apps.js";

describe("appIcon / isAppLauncher", () => {
  it("resolves known apps case-insensitively", () => {
    expect(appIcon("Netflix")).toBe("mdi:netflix");
    expect(appIcon("infuse")).toBe("mdi:play-box-multiple");
    expect(appIcon("Nope")).toBeUndefined();
  });
  it("detects an app-launcher source list", () => {
    expect(isAppLauncher(["HDMI 1", "TV", "Netflix"])).toBe(true);
    expect(isAppLauncher(["HDMI 1", "HDMI 2"])).toBe(false);
  });
});

describe("splitFeaturedApps", () => {
  it("promotes Apple TV+/Infuse/Netflix in order and removes them from the rest", () => {
    const sources = ["App Store", "Infuse", "Netflix", "YouTube", "TV", "HBO Max"];
    const { featured, rest } = splitFeaturedApps(sources);
    // FEATURED_APPS order: TV(Apple TV+), Infuse, Netflix.
    expect(featured.map((f) => f.label)).toEqual(["Apple TV+", "Infuse", "Netflix"]);
    expect(featured.map((f) => f.source)).toEqual(["TV", "Infuse", "Netflix"]);
    expect(rest).toEqual(["App Store", "YouTube", "HBO Max"]);
  });

  it("matches names case-insensitively and keeps the real source string", () => {
    const { featured, rest } = splitFeaturedApps(["netflix", "Plex"]);
    expect(featured).toHaveLength(1);
    expect(featured[0]).toMatchObject({ label: "Netflix", source: "netflix" });
    expect(rest).toEqual(["Plex"]);
  });

  it("returns no featured apps when none are present", () => {
    const { featured, rest } = splitFeaturedApps(["HDMI 1", "HDMI 2"]);
    expect(featured).toEqual([]);
    expect(rest).toEqual(["HDMI 1", "HDMI 2"]);
  });
});
