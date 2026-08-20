import { afterEach, describe, expect, it, vi } from "vitest";
import type { WidgetConfig } from "../config/schema.js";
import type { HomeAssistant } from "../types/hass.js";
import "./action.js";
import type { ActionWidget } from "./action.js";

afterEach(() => document.body.replaceChildren());

describe("ActionWidget", () => {
  it("passes service data and target through the Home Assistant call separately", async () => {
    const callService = vi.fn().mockResolvedValue(undefined);
    const hass = {
      states: {},
      connected: true,
      callService,
    } as unknown as HomeAssistant;
    const config: WidgetConfig = {
      id: "lights-off",
      type: "action",
      name: "Lights off",
      size: { compact: "1x1", medium: "1x1", wide: "2x1" },
      options: {
        service: "light.turn_off",
        data: { transition: 2 },
        target: { entity_id: "light.all_lights" },
      },
    };
    const element = document.createElement("hd-widget-action") as ActionWidget;
    element.hass = hass;
    element.config = config;
    document.body.appendChild(element);
    await element.updateComplete;

    element.shadowRoot!.querySelector("hd-widget-frame")!
      .dispatchEvent(new CustomEvent("hd-quick"));

    await vi.waitFor(() => expect(callService).toHaveBeenCalledWith(
      "light",
      "turn_off",
      { transition: 2 },
      { entity_id: "light.all_lights" },
    ));
  });
});
