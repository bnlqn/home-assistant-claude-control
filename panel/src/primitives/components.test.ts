import { describe, it, expect } from "vitest";
import "./slider.js";
import "./toggle.js";
import "../widgets/widget-frame.js";
import { requestConfirm } from "./feedback.js";
import { designTokens } from "../design-system/tokens.js";
import type { HdSlider } from "./slider.js";
import type { HdToggle } from "./toggle.js";

async function mount<T extends HTMLElement>(tag: string, props: Partial<T> = {}): Promise<T> {
  const el = document.createElement(tag) as T;
  Object.assign(el, props);
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<unknown> }).updateComplete;
  return el;
}

describe("hd-slider", () => {
  it("emits hd-change with a stepped, clamped value on keyboard use", async () => {
    const el = await mount<HdSlider>("hd-slider", { min: 0, max: 100, step: 1, value: 50 });
    const changes: number[] = [];
    el.addEventListener("hd-change", (e) => changes.push((e as CustomEvent).detail.value));
    const track = el.shadowRoot!.querySelector(".track") as HTMLElement;
    track.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(el.value).toBe(51);
    expect(changes.at(-1)).toBe(51);
    track.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(el.value).toBe(0);
    track.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
    expect(el.value).toBe(100);
    // Cannot exceed max.
    track.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(el.value).toBe(100);
    el.remove();
  });

  it("exposes slider ARIA semantics", async () => {
    const el = await mount<HdSlider>("hd-slider", { min: 0, max: 100, value: 30, valueText: "30%" });
    const track = el.shadowRoot!.querySelector(".track")!;
    expect(track.getAttribute("role")).toBe("slider");
    expect(track.getAttribute("aria-valuenow")).toBe("30");
    expect(track.getAttribute("aria-valuetext")).toBe("30%");
    el.remove();
  });
});

describe("hd-toggle", () => {
  it("flips and emits hd-toggle on click", async () => {
    const el = await mount<HdToggle>("hd-toggle", { checked: false });
    let detail: { checked: boolean } | undefined;
    el.addEventListener("hd-toggle", (e) => (detail = (e as CustomEvent).detail));
    (el.shadowRoot!.querySelector("button") as HTMLButtonElement).click();
    expect(el.checked).toBe(true);
    expect(detail?.checked).toBe(true);
    el.remove();
  });
});

describe("hd-widget-frame interaction targets", () => {
  it("separates the quick action (icon) from opening detail (title)", async () => {
    const el = await mount<HTMLElement>("hd-widget-frame", {
      // @ts-expect-error assigning element props
      name: "Lamp",
      quickKind: "toggle",
      hasDetail: true,
    });
    let quick = 0;
    let activate = 0;
    el.addEventListener("hd-quick", () => quick++);
    el.addEventListener("hd-activate", () => activate++);
    const iconBtn = el.shadowRoot!.querySelector(".icon-btn") as HTMLElement;
    const title = el.shadowRoot!.querySelector("button.titles") as HTMLElement;
    iconBtn.click();
    title.click();
    expect(quick).toBe(1);
    expect(activate).toBe(1);
    el.remove();
  });
});

describe("confirmation bus", () => {
  it("resolves via a handling ancestor (sensitive-action gate)", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.addEventListener("hd-confirm", (e) => {
      (e as CustomEvent).detail.resolve(true);
    });
    const result = await requestConfirm(host, { title: "Unlock?", confirmLabel: "Unlock", destructive: true });
    expect(result).toBe(true);
    host.remove();
  });
});

describe("reduced motion", () => {
  it("design tokens zero out motion durations under prefers-reduced-motion", () => {
    const css = designTokens.cssText;
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("--motion-surface: 0ms");
  });
});
