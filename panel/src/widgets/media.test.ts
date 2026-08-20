import { afterEach, describe, expect, it, vi } from "vitest";
import type { WidgetConfig } from "../config/schema.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { MediaWidget } from "./media.js";

const config = {
  id: "media-test",
  type: "media",
  entity: "media_player.test",
  size: { compact: "2x1", medium: "2x1", wide: "2x2" },
} as WidgetConfig;

function hass(): HomeAssistant {
  const media: HassEntity = {
    entity_id: "media_player.test",
    state: "paused",
    attributes: {
      friendly_name: "Test player",
      media_title: "A deliberately long media title for marquee measurement",
      app_name: "Test app",
      supported_features: 0,
    },
    last_changed: "",
    last_updated: "",
  };
  return { states: { [media.entity_id]: media }, connected: true } as unknown as HomeAssistant;
}

afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

describe("MediaWidget update lifecycle", () => {
  it("measures a marquee without scheduling state from updated()", async () => {
    const element = new MediaWidget();
    element.hass = hass();
    element.config = config;
    element.currentSize = "2x1";
    document.body.appendChild(element);
    await element.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const title = element.shadowRoot!.querySelector(".np-title") as HTMLElement;
    const inner = element.shadowRoot!.querySelector(".np-title-inner") as HTMLElement;
    Object.defineProperty(title, "clientWidth", { configurable: true, value: 100 });
    Object.defineProperty(inner, "scrollWidth", { configurable: true, value: 240 });

    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    element.currentSize = "1x2";
    await element.updateComplete;
    await new Promise((resolve) => requestAnimationFrame(resolve));
    await element.updateComplete;

    const lifecycleWarnings = warn.mock.calls.filter(([message]) =>
      String(message).includes("scheduled an update after an update completed"),
    );
    expect(lifecycleWarnings).toEqual([]);
    expect(title.getAttribute("data-marquee")).toBe("on");
  });
});
