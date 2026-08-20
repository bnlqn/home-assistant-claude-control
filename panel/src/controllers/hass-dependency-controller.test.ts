import { describe, expect, it, vi } from "vitest";
import type { ReactiveControllerHost } from "lit";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { HassDependencyController } from "./hass-dependency-controller.js";

const state = (entityId: string, value: string): HassEntity => ({
  entity_id: entityId,
  state: value,
  attributes: {},
  last_changed: "2026-08-20T10:00:00Z",
  last_updated: "2026-08-20T10:00:00Z",
});

const hass = (states: HassEntity[], connected = true): HomeAssistant => ({
  states: Object.fromEntries(states.map((item) => [item.entity_id, item])),
  connected,
}) as unknown as HomeAssistant;

describe("HassDependencyController", () => {
  it("ignores unrelated state objects and detects dependencies or connectivity changes", () => {
    const addController = vi.fn();
    const light = state("light.test", "on");
    const unrelated = state("sensor.unrelated", "1");
    const controller = new HassDependencyController(
      { addController } as unknown as ReactiveControllerHost,
      () => [light.entity_id, light.entity_id],
    );
    const previous = hass([light, unrelated]);

    expect(addController).toHaveBeenCalledWith(controller);
    expect(controller.hasChanged(previous, hass([light, state(unrelated.entity_id, "2")]))).toBe(false);
    expect(controller.hasChanged(previous, hass([state(light.entity_id, "off"), unrelated]))).toBe(true);
    expect(controller.hasChanged(previous, hass([light, unrelated], false))).toBe(true);
  });
});
