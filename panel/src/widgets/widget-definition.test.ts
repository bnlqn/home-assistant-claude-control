import { afterEach, describe, expect, it } from "vitest";
import type { LitElement } from "lit";
import type { WidgetConfig, WidgetSize } from "../config/schema.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import {
  CLIMATE_WIDGET_DEFINITION,
  LIGHT_WIDGET_DEFINITION,
  WIDGET_DEFINITIONS,
  widgetDefinition,
} from "./widget-definition.js";
import { widgetTag } from "./widget-registry.js";

const sizes = (compact: WidgetSize, medium: WidgetSize, wide: WidgetSize) => ({
  compact,
  medium,
  wide,
});

const lightConfig: WidgetConfig = {
  id: "light-test",
  type: "light",
  entity: "light.test",
  size: sizes("1x1", "2x1", "2x2"),
};

const climateConfig: WidgetConfig = {
  id: "climate-test",
  type: "climate",
  entity: "climate.test",
  size: sizes("2x1", "2x1", "2x2"),
  options: {
    switches: [
      { entity: "switch.eco", name: "Economy" },
      { entity: "switch.quiet", name: "Quiet fan" },
    ],
  },
};

function entity(entityId: string, state: string, attributes: Record<string, unknown>): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: "2026-08-20T10:00:00Z",
    last_updated: "2026-08-20T10:00:00Z",
  };
}

function hass(): HomeAssistant {
  const states = [
    entity("light.test", "on", { friendly_name: "Test light", brightness: 180, supported_color_modes: ["brightness"] }),
    entity("climate.test", "cool", {
      friendly_name: "Test climate",
      current_temperature: 24,
      temperature: 21,
      hvac_modes: ["off", "cool"],
      supported_features: 1,
    }),
    entity("switch.eco", "on", { friendly_name: "Economy" }),
    entity("switch.quiet", "off", { friendly_name: "Quiet fan" }),
  ];
  return {
    states: Object.fromEntries(states.map((state) => [state.entity_id, state])),
    connected: true,
  } as unknown as HomeAssistant;
}

afterEach(() => document.body.replaceChildren());

describe("widget definitions", () => {
  it("keeps hosting metadata together for migrated widgets", () => {
    expect(Object.keys(WIDGET_DEFINITIONS)).toEqual(["light", "climate"]);
    expect(widgetDefinition("light")).toBe(LIGHT_WIDGET_DEFINITION);
    expect(widgetDefinition("climate")).toBe(CLIMATE_WIDGET_DEFINITION);
    expect(widgetDefinition("sensor")).toBeUndefined();

    for (const definition of [LIGHT_WIDGET_DEFINITION, CLIMATE_WIDGET_DEFINITION]) {
      expect(definition.section).toBe("devices");
      expect(definition.icon).toMatch(/^mdi:/);
      expect(definition.requiresEntity).toBe(true);
      expect(definition.hasDetail).toBe(true);
      expect(definition.detailRenderer).toBe(definition.type);
      const supportedSizes: readonly WidgetSize[] = definition.supportedSizes;
      expect(Object.values(definition.defaultSize).every((size) => supportedSizes.includes(size))).toBe(true);
    }
  });

  it("declares every entity dependency, including climate companion switches", () => {
    expect(LIGHT_WIDGET_DEFINITION.dependencyIds(lightConfig)).toEqual(["light.test"]);
    expect(CLIMATE_WIDGET_DEFINITION.dependencyIds(climateConfig)).toEqual([
      "climate.test",
      "switch.eco",
      "switch.quiet",
    ]);
  });

  it("validates climate-specific options at the definition boundary", () => {
    expect(CLIMATE_WIDGET_DEFINITION.validateOptions?.(climateConfig.options)).toEqual([]);
    expect(CLIMATE_WIDGET_DEFINITION.validateOptions?.({ switches: "switch.eco" })).toEqual([
      { path: "switches", message: "Climate `switches` must be an array." },
    ]);
    expect(CLIMATE_WIDGET_DEFINITION.validateOptions?.({ switches: [{ entity: "bad", name: "" }] })).toEqual([
      { path: "switches[0].entity", message: "Climate switch requires a valid entity_id." },
      { path: "switches[0].name", message: "Climate switch requires a non-empty name." },
    ]);
  });

  it("loads the registered element and renders every supported footprint", async () => {
    for (const [definition, config] of [
      [LIGHT_WIDGET_DEFINITION, lightConfig],
      [CLIMATE_WIDGET_DEFINITION, climateConfig],
    ] as const) {
      expect(widgetTag(definition.type)).toBe(definition.tag);
      await definition.load();
      expect(customElements.get(definition.tag)).toBeDefined();

      const element = document.createElement(definition.tag) as LitElement & {
        hass: HomeAssistant;
        config: WidgetConfig;
        currentSize: WidgetSize;
      };
      element.hass = hass();
      element.config = config;
      document.body.appendChild(element);

      for (const size of definition.supportedSizes) {
        element.currentSize = size;
        await element.updateComplete;
        expect(element.shadowRoot?.querySelector("hd-widget-frame")).not.toBeNull();
      }
      element.remove();
    }
  });
});
