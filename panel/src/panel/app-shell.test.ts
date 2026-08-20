import { describe, expect, it, vi } from "vitest";
import "./app-shell.js";
import type { HdAppShell } from "./app-shell.js";

describe("hd-app-shell", () => {
  it("resets the scroll container it owns", async () => {
    const shell = document.createElement("hd-app-shell") as HdAppShell;
    shell.views = [{ id: "overview", label: "Home", icon: "mdi:home", type: "overview" }];
    shell.currentViewId = "overview";
    document.body.appendChild(shell);
    await shell.updateComplete;

    const content = shell.shadowRoot!.querySelector<HTMLElement>(".content")!;
    const scrollTo = vi.fn();
    Object.defineProperty(content, "scrollTo", { value: scrollTo });

    shell.scrollToTop();

    expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
    shell.remove();
  });

  it("maps shape-aware display profiles to intentional navigation modes", async () => {
    const shell = document.createElement("hd-app-shell") as HdAppShell;
    shell.views = [{ id: "overview", label: "Home", icon: "mdi:home", type: "overview" }];
    shell.currentViewId = "overview";
    document.body.appendChild(shell);

    for (const [profile, mode] of [
      ["phonePortrait", "compact"],
      ["phoneLandscape", "compact"],
      ["tabletPortrait", "rail"],
      ["tabletLandscape", "rail"],
      ["desktop", "sidebar"],
      ["wall", "sidebar"],
    ] as const) {
      shell.displayProfile = profile;
      await shell.updateComplete;
      expect(shell.shadowRoot!.querySelector<HTMLElement>(".shell")!.dataset.mode).toBe(mode);
    }

    shell.remove();
  });
});
