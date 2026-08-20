import { afterEach, describe, expect, it } from "vitest";
import type { LitElement } from "lit";
import type { WidgetConfig, WidgetSize } from "../config/schema.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import {
  ACTION_WIDGET_DEFINITION,
  ALARM_WIDGET_DEFINITION,
  BINARY_SENSOR_WIDGET_DEFINITION,
  BUTTON_WIDGET_DEFINITION,
  CAMERA_WIDGET_DEFINITION,
  CLIMATE_WIDGET_DEFINITION,
  COVER_WIDGET_DEFINITION,
  ELECTRICITY_TOTAL_WIDGET_DEFINITION,
  ENERGY_CHART_WIDGET_DEFINITION,
  ENERGY_WIDGET_DEFINITION,
  FAN_WIDGET_DEFINITION,
  LIGHT_WIDGET_DEFINITION,
  LOCK_WIDGET_DEFINITION,
  MEDIA_WIDGET_DEFINITION,
  METRIC_TILE_WIDGET_DEFINITION,
  PERSON_WIDGET_DEFINITION,
  POWERFLOW_WIDGET_DEFINITION,
  SCENE_WIDGET_DEFINITION,
  SCRIPT_WIDGET_DEFINITION,
  SOLAR_CHARGING_WIDGET_DEFINITION,
  SENSOR_WIDGET_DEFINITION,
  SWITCH_WIDGET_DEFINITION,
  VACUUM_WIDGET_DEFINITION,
  WEATHER_WIDGET_DEFINITION,
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

const switchConfig: WidgetConfig = {
  id: "switch-test",
  type: "switch",
  entity: "switch.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const fanConfig: WidgetConfig = {
  id: "fan-test",
  type: "fan",
  entity: "fan.test",
  size: sizes("1x1", "2x1", "1x2"),
};

const coverConfig: WidgetConfig = {
  id: "cover-test",
  type: "cover",
  entity: "cover.test",
  size: sizes("1x1", "2x1", "2x2"),
};

const lockConfig: WidgetConfig = {
  id: "lock-test",
  type: "lock",
  entity: "lock.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const vacuumConfig: WidgetConfig = {
  id: "vacuum-test",
  type: "vacuum",
  entity: "vacuum.test",
  size: sizes("1x1", "2x1", "2x2"),
  options: { brand: "roborock" },
};

const mediaConfig: WidgetConfig = {
  id: "media-test",
  type: "media",
  entity: "media_player.test",
  size: sizes("2x1", "2x1", "2x2"),
};

const sensorConfig: WidgetConfig = {
  id: "sensor-test",
  type: "sensor",
  entity: "sensor.test",
  size: sizes("1x1", "2x1", "2x2"),
};

const weatherConfig: WidgetConfig = {
  id: "weather-test",
  type: "weather",
  entity: "weather.test",
  size: sizes("2x1", "1x2", "2x2"),
};

const binarySensorConfig: WidgetConfig = {
  id: "binary-sensor-test",
  type: "binary_sensor",
  entity: "binary_sensor.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const personConfig: WidgetConfig = {
  id: "person-test",
  type: "person",
  entity: "person.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const cameraConfig: WidgetConfig = {
  id: "camera-test",
  type: "camera",
  entity: "camera.test",
  size: sizes("2x1", "2x1", "2x2"),
};

const sceneConfig: WidgetConfig = {
  id: "scene-test",
  type: "scene",
  entity: "scene.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const scriptConfig: WidgetConfig = {
  id: "script-test",
  type: "script",
  entity: "script.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const buttonConfig: WidgetConfig = {
  id: "button-test",
  type: "button",
  entity: "button.test",
  size: sizes("1x1", "1x1", "2x1"),
};

const alarmConfig: WidgetConfig = {
  id: "alarm-test",
  type: "alarm",
  entity: "alarm_control_panel.test",
  size: sizes("1x1", "2x1", "2x2"),
};

const actionConfig: WidgetConfig = {
  id: "action-test",
  type: "action",
  name: "Lights off",
  size: sizes("1x1", "1x1", "2x1"),
  options: { service: "light.turn_off", target: { entity_id: "light.test" } },
};

const metricTileConfig: WidgetConfig = {
  id: "metric-test",
  type: "metrictile",
  entity: "sensor.grid_power",
  name: "Grid power",
  size: sizes("1x1", "1x1", "2x1"),
  options: { accent: "accent", format: "power", status: "gridDirection" },
};

const energyConfig: WidgetConfig = {
  id: "energy-test",
  type: "energy",
  size: sizes("2x1", "2x2", "2x2"),
  options: { gridPower: "sensor.grid_power", solarPower: "sensor.solar_power" },
};

const powerflowConfig: WidgetConfig = {
  id: "powerflow-test",
  type: "powerflow",
  size: sizes("2x2", "3x3", "3x3"),
  options: { gridPower: "sensor.grid_power", solarPower: "sensor.solar_power" },
};

const solarChargingConfig: WidgetConfig = {
  id: "solar-charging-test",
  type: "solarcharging",
  size: sizes("2x1", "2x2", "2x2"),
  options: { master: "input_boolean.solar_charging", battery: "sensor.battery" },
};

const energyChartConfig: WidgetConfig = {
  id: "energy-chart-test",
  type: "energychart",
  size: sizes("2x2", "4x2", "4x2"),
  options: { gridImport: "sensor.grid_import", defaultPeriod: "day" },
};

const electricityTotalConfig: WidgetConfig = {
  id: "electricity-total-test",
  type: "electricitytotal",
  size: sizes("2x2", "4x2", "4x2"),
  options: { importEnergy: "sensor.grid_import", exportEnergy: "sensor.grid_export" },
};

const definitionConfigs = [
  [LIGHT_WIDGET_DEFINITION, lightConfig],
  [CLIMATE_WIDGET_DEFINITION, climateConfig],
  [SWITCH_WIDGET_DEFINITION, switchConfig],
  [FAN_WIDGET_DEFINITION, fanConfig],
  [COVER_WIDGET_DEFINITION, coverConfig],
  [LOCK_WIDGET_DEFINITION, lockConfig],
  [VACUUM_WIDGET_DEFINITION, vacuumConfig],
  [MEDIA_WIDGET_DEFINITION, mediaConfig],
  [SENSOR_WIDGET_DEFINITION, sensorConfig],
  [WEATHER_WIDGET_DEFINITION, weatherConfig],
  [BINARY_SENSOR_WIDGET_DEFINITION, binarySensorConfig],
  [PERSON_WIDGET_DEFINITION, personConfig],
  [CAMERA_WIDGET_DEFINITION, cameraConfig],
  [SCENE_WIDGET_DEFINITION, sceneConfig],
  [SCRIPT_WIDGET_DEFINITION, scriptConfig],
  [BUTTON_WIDGET_DEFINITION, buttonConfig],
  [ALARM_WIDGET_DEFINITION, alarmConfig],
  [ACTION_WIDGET_DEFINITION, actionConfig],
  [ENERGY_WIDGET_DEFINITION, energyConfig],
  [POWERFLOW_WIDGET_DEFINITION, powerflowConfig],
  [SOLAR_CHARGING_WIDGET_DEFINITION, solarChargingConfig],
  [ENERGY_CHART_WIDGET_DEFINITION, energyChartConfig],
  [METRIC_TILE_WIDGET_DEFINITION, metricTileConfig],
  [ELECTRICITY_TOTAL_WIDGET_DEFINITION, electricityTotalConfig],
] as const;

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
    entity("switch.test", "on", { friendly_name: "Test switch" }),
    entity("fan.test", "on", {
      friendly_name: "Test fan",
      percentage: 40,
      supported_features: 1,
    }),
    entity("cover.test", "open", {
      friendly_name: "Test cover",
      current_position: 60,
      supported_features: 1 | 2 | 4 | 8,
    }),
    entity("lock.test", "locked", { friendly_name: "Test lock" }),
    entity("vacuum.test", "docked", {
      friendly_name: "Test vacuum",
      battery_level: 85,
      fan_speed_list: ["quiet", "balanced"],
      supported_features: 4 | 16 | 32 | 512 | 8192,
    }),
    entity("media_player.test", "playing", {
      friendly_name: "Test media",
      media_title: "Night Drive",
      app_name: "Music",
      supported_features: 1 | 16 | 32 | 16384,
    }),
    entity("sensor.test", "21.4", {
      friendly_name: "Test sensor",
      unit_of_measurement: "°C",
    }),
    entity("weather.test", "partlycloudy", {
      friendly_name: "Test weather",
      temperature: 20,
      humidity: 58,
      forecast: [],
    }),
    entity("binary_sensor.test", "on", { friendly_name: "Test binary sensor" }),
    entity("person.test", "home", { friendly_name: "Test person" }),
    entity("camera.test", "streaming", {
      friendly_name: "Test camera",
      entity_picture: "/api/camera_proxy/camera.test",
    }),
    entity("scene.test", "scening", { friendly_name: "Test scene" }),
    entity("script.test", "off", { friendly_name: "Test script" }),
    entity("button.test", "unknown", { friendly_name: "Test button" }),
    entity("alarm_control_panel.test", "disarmed", { friendly_name: "Test alarm" }),
    entity("sensor.grid_power", "900", { friendly_name: "Grid power", unit_of_measurement: "W" }),
    entity("sensor.solar_power", "2400", { friendly_name: "Solar power", unit_of_measurement: "W" }),
    entity("input_boolean.solar_charging", "on", { friendly_name: "Solar charging" }),
    entity("sensor.battery", "75", { friendly_name: "Battery", unit_of_measurement: "%" }),
    entity("sensor.grid_import", "12.4", { friendly_name: "Grid import", unit_of_measurement: "kWh" }),
    entity("sensor.grid_export", "3.2", { friendly_name: "Grid export", unit_of_measurement: "kWh" }),
  ];
  return {
    states: Object.fromEntries(states.map((state) => [state.entity_id, state])),
    connected: true,
  } as unknown as HomeAssistant;
}

afterEach(() => document.body.replaceChildren());

describe("widget definitions", () => {
  it("keeps hosting metadata together for migrated widgets", () => {
    expect(Object.keys(WIDGET_DEFINITIONS)).toEqual([
      "light",
      "climate",
      "switch",
      "fan",
      "cover",
      "lock",
      "vacuum",
      "media",
      "sensor",
      "weather",
      "binary_sensor",
      "person",
      "camera",
      "scene",
      "script",
      "button",
      "alarm",
      "action",
      "energy",
      "powerflow",
      "solarcharging",
      "energychart",
      "metrictile",
      "electricitytotal",
    ]);
    expect(widgetDefinition("light")).toBe(LIGHT_WIDGET_DEFINITION);
    expect(widgetDefinition("climate")).toBe(CLIMATE_WIDGET_DEFINITION);
    expect(widgetDefinition("vacuum")).toBe(VACUUM_WIDGET_DEFINITION);
    expect(widgetDefinition("sensor")).toBe(SENSOR_WIDGET_DEFINITION);
    expect(widgetDefinition("weather")).toBe(WEATHER_WIDGET_DEFINITION);
    expect(widgetDefinition("binary_sensor")).toBe(BINARY_SENSOR_WIDGET_DEFINITION);
    expect(widgetDefinition("person")).toBe(PERSON_WIDGET_DEFINITION);
    expect(widgetDefinition("camera")).toBe(CAMERA_WIDGET_DEFINITION);
    expect(widgetDefinition("scene")).toBe(SCENE_WIDGET_DEFINITION);
    expect(widgetDefinition("action")).toBe(ACTION_WIDGET_DEFINITION);
    expect(widgetDefinition("metrictile")).toBe(METRIC_TILE_WIDGET_DEFINITION);
    expect(widgetDefinition("electricitytotal")).toBe(ELECTRICITY_TOTAL_WIDGET_DEFINITION);

    for (const definition of [
      LIGHT_WIDGET_DEFINITION,
      CLIMATE_WIDGET_DEFINITION,
      SWITCH_WIDGET_DEFINITION,
      FAN_WIDGET_DEFINITION,
      COVER_WIDGET_DEFINITION,
      LOCK_WIDGET_DEFINITION,
      VACUUM_WIDGET_DEFINITION,
      CAMERA_WIDGET_DEFINITION,
      SCENE_WIDGET_DEFINITION,
      SCRIPT_WIDGET_DEFINITION,
      BUTTON_WIDGET_DEFINITION,
      ALARM_WIDGET_DEFINITION,
    ]) {
      expect(definition.section).toBe("devices");
    }

    for (const definition of [
      LIGHT_WIDGET_DEFINITION,
      CLIMATE_WIDGET_DEFINITION,
      SWITCH_WIDGET_DEFINITION,
      FAN_WIDGET_DEFINITION,
      COVER_WIDGET_DEFINITION,
      LOCK_WIDGET_DEFINITION,
      VACUUM_WIDGET_DEFINITION,
      MEDIA_WIDGET_DEFINITION,
      SENSOR_WIDGET_DEFINITION,
      WEATHER_WIDGET_DEFINITION,
      BINARY_SENSOR_WIDGET_DEFINITION,
      PERSON_WIDGET_DEFINITION,
      CAMERA_WIDGET_DEFINITION,
      ALARM_WIDGET_DEFINITION,
      METRIC_TILE_WIDGET_DEFINITION,
    ]) {
      expect(definition.icon).toMatch(/^mdi:/);
      expect(definition.requiresEntity).toBe(true);
      expect(definition.hasDetail).toBe(true);
      const supportedSizes: readonly WidgetSize[] = definition.supportedSizes;
      expect(Object.values(definition.defaultSize).every((size) => supportedSizes.includes(size))).toBe(true);
    }

    expect(Object.fromEntries(Object.entries(WIDGET_DEFINITIONS).map(([type, definition]) => [
      type,
      definition.detailRenderer,
    ]))).toEqual({
      light: "light",
      climate: "climate",
      switch: "generic",
      fan: "generic",
      cover: "cover",
      lock: "lock",
      vacuum: "vacuum",
      media: "media",
      sensor: "sensor",
      weather: "weather",
      binary_sensor: "generic",
      person: "generic",
      camera: "generic",
      scene: undefined,
      script: undefined,
      button: undefined,
      alarm: "generic",
      action: undefined,
      energy: "energy",
      powerflow: "powerflow",
      solarcharging: "solarcharging",
      energychart: undefined,
      metrictile: "generic",
      electricitytotal: undefined,
    });
    expect(MEDIA_WIDGET_DEFINITION.section).toBe("media");
    expect(SENSOR_WIDGET_DEFINITION.section).toBe("sensors");
    expect(WEATHER_WIDGET_DEFINITION.section).toBe("sensors");
    expect(BINARY_SENSOR_WIDGET_DEFINITION.section).toBe("sensors");
    expect(PERSON_WIDGET_DEFINITION.section).toBe("sensors");
    for (const definition of [
      SCENE_WIDGET_DEFINITION,
      SCRIPT_WIDGET_DEFINITION,
      BUTTON_WIDGET_DEFINITION,
      ACTION_WIDGET_DEFINITION,
      ENERGY_CHART_WIDGET_DEFINITION,
      ELECTRICITY_TOTAL_WIDGET_DEFINITION,
    ]) {
      expect(definition.hasDetail).toBe(false);
    }
    for (const definition of [SCENE_WIDGET_DEFINITION, SCRIPT_WIDGET_DEFINITION, BUTTON_WIDGET_DEFINITION, ACTION_WIDGET_DEFINITION]) {
      expect(definition.quickAction).toBe("activate");
    }
    expect(ACTION_WIDGET_DEFINITION.requiresEntity).toBe(false);
    for (const definition of [
      ENERGY_WIDGET_DEFINITION,
      POWERFLOW_WIDGET_DEFINITION,
      SOLAR_CHARGING_WIDGET_DEFINITION,
      ENERGY_CHART_WIDGET_DEFINITION,
      METRIC_TILE_WIDGET_DEFINITION,
      ELECTRICITY_TOTAL_WIDGET_DEFINITION,
    ]) {
      expect(definition.section).toBe("energy");
    }
  });

  it("declares every entity dependency, including climate companion switches", () => {
    expect(LIGHT_WIDGET_DEFINITION.dependencyIds(lightConfig)).toEqual(["light.test"]);
    expect(CLIMATE_WIDGET_DEFINITION.dependencyIds(climateConfig)).toEqual([
      "climate.test",
      "switch.eco",
      "switch.quiet",
    ]);
    expect(SWITCH_WIDGET_DEFINITION.dependencyIds(switchConfig)).toEqual(["switch.test"]);
    expect(FAN_WIDGET_DEFINITION.dependencyIds(fanConfig)).toEqual(["fan.test"]);
    expect(COVER_WIDGET_DEFINITION.dependencyIds(coverConfig)).toEqual(["cover.test"]);
    expect(LOCK_WIDGET_DEFINITION.dependencyIds(lockConfig)).toEqual(["lock.test"]);
    expect(VACUUM_WIDGET_DEFINITION.dependencyIds(vacuumConfig)).toEqual(["vacuum.test"]);
    expect(MEDIA_WIDGET_DEFINITION.dependencyIds(mediaConfig)).toEqual(["media_player.test"]);
    expect(SENSOR_WIDGET_DEFINITION.dependencyIds(sensorConfig)).toEqual(["sensor.test"]);
    expect(WEATHER_WIDGET_DEFINITION.dependencyIds(weatherConfig)).toEqual(["weather.test"]);
    expect(BINARY_SENSOR_WIDGET_DEFINITION.dependencyIds(binarySensorConfig)).toEqual(["binary_sensor.test"]);
    expect(PERSON_WIDGET_DEFINITION.dependencyIds(personConfig)).toEqual(["person.test"]);
    expect(CAMERA_WIDGET_DEFINITION.dependencyIds(cameraConfig)).toEqual(["camera.test"]);
    expect(SCENE_WIDGET_DEFINITION.dependencyIds(sceneConfig)).toEqual(["scene.test"]);
    expect(SCRIPT_WIDGET_DEFINITION.dependencyIds(scriptConfig)).toEqual(["script.test"]);
    expect(BUTTON_WIDGET_DEFINITION.dependencyIds(buttonConfig)).toEqual(["button.test"]);
    expect(ALARM_WIDGET_DEFINITION.dependencyIds(alarmConfig)).toEqual(["alarm_control_panel.test"]);
    expect(ACTION_WIDGET_DEFINITION.dependencyIds()).toEqual([]);
    expect(ENERGY_WIDGET_DEFINITION.dependencyIds(energyConfig)).toEqual([
      "sensor.grid_power",
      "sensor.solar_power",
    ]);
    expect(POWERFLOW_WIDGET_DEFINITION.dependencyIds(powerflowConfig)).toEqual([
      "sensor.grid_power",
      "sensor.solar_power",
    ]);
    expect(SOLAR_CHARGING_WIDGET_DEFINITION.dependencyIds(solarChargingConfig)).toEqual([
      "input_boolean.solar_charging",
      "sensor.battery",
    ]);
    expect(ENERGY_CHART_WIDGET_DEFINITION.dependencyIds(energyChartConfig)).toEqual(["sensor.grid_import"]);
    expect(METRIC_TILE_WIDGET_DEFINITION.dependencyIds(metricTileConfig)).toEqual(["sensor.grid_power"]);
    expect(ELECTRICITY_TOTAL_WIDGET_DEFINITION.dependencyIds(electricityTotalConfig)).toEqual([
      "sensor.grid_import",
      "sensor.grid_export",
    ]);
  });

  it("keeps split device elements unloaded until their definition is requested", () => {
    expect(customElements.get(SWITCH_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(FAN_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(LOCK_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(MEDIA_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(SENSOR_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(WEATHER_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(BINARY_SENSOR_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(PERSON_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(CAMERA_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(SCENE_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(SCRIPT_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(BUTTON_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(ALARM_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(ACTION_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(ENERGY_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(POWERFLOW_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(SOLAR_CHARGING_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(ENERGY_CHART_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(METRIC_TILE_WIDGET_DEFINITION.tag)).toBeUndefined();
    expect(customElements.get(ELECTRICITY_TOTAL_WIDGET_DEFINITION.tag)).toBeUndefined();
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

  it("validates vacuum hero options at the definition boundary", () => {
    expect(VACUUM_WIDGET_DEFINITION.validateOptions?.(vacuumConfig.options)).toEqual([]);
    expect(VACUUM_WIDGET_DEFINITION.validateOptions?.({
      brand: "unknown",
      branded: "yes",
      hero: 1,
    })).toEqual([
      { path: "brand", message: "Vacuum `brand` must be `roborock`." },
      { path: "branded", message: "Vacuum `branded` must be a boolean." },
      { path: "hero", message: "Vacuum `hero` must be a boolean." },
    ]);
  });

  it("validates entityless action options at the definition boundary", () => {
    expect(ACTION_WIDGET_DEFINITION.validateOptions?.(actionConfig.options)).toEqual([]);
    expect(ACTION_WIDGET_DEFINITION.validateOptions?.({
      service: "bad",
      data: [],
      target: "light.test",
    })).toEqual([
      { path: "service", message: "Action `service` must use `domain.service` form." },
      { path: "data", message: "Action `data` must be an object." },
      { path: "target", message: "Action `target` must be an object." },
    ]);
  });

  it("validates composite options at the definition boundary", () => {
    expect(ENERGY_WIDGET_DEFINITION.validateOptions?.({ gridPower: "invalid" })).toEqual([
      { path: "gridPower", message: "Energy `gridPower` must be a valid entity_id." },
    ]);
    expect(SOLAR_CHARGING_WIDGET_DEFINITION.validateOptions?.({ brand: "unknown", master: "invalid" })).toEqual([
      { path: "master", message: "Solar charging `master` must be a valid entity_id." },
      { path: "brand", message: "Solar charging `brand` must be `tesla`." },
    ]);
    expect(METRIC_TILE_WIDGET_DEFINITION.validateOptions?.({ accent: "pink", connected: "invalid" })).toEqual([
      { path: "connected", message: "Metric tile `connected` must be a valid entity_id." },
      { path: "accent", message: "Metric tile `accent` is not supported." },
    ]);
  });

  it("loads the registered element and renders every supported footprint", async () => {
    for (const [definition, config] of definitionConfigs) {
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
        const content = element.shadowRoot?.querySelector("hd-widget-frame, section, button.tile, .card");
        expect(content).not.toBeNull();
      }
      element.remove();
    }
  });

  it("renders every definition with unavailable, unknown, and disconnected dependencies", async () => {
    for (const [definition, config] of definitionConfigs) {
      await definition.load();
      for (const scenario of ["unavailable", "unknown", "disconnected"] as const) {
        const scenarioHass = hass();
        if (scenario === "disconnected") {
          scenarioHass.connected = false;
        } else {
          for (const entityId of definition.dependencyIds(config as never)) {
            const current = scenarioHass.states[entityId];
            if (current) scenarioHass.states[entityId] = { ...current, state: scenario };
          }
        }
        const element = document.createElement(definition.tag) as LitElement & {
          hass: HomeAssistant;
          config: WidgetConfig;
          currentSize: WidgetSize;
        };
        element.hass = scenarioHass;
        element.config = config;
        element.currentSize = definition.defaultSize.compact;
        document.body.appendChild(element);
        await element.updateComplete;

        expect(element.shadowRoot?.childElementCount).toBeGreaterThan(0);
        element.remove();
      }
    }
  });

  it("renders the explicit vacuum hero option as a full-bleed hero", async () => {
    await VACUUM_WIDGET_DEFINITION.load();
    const element = document.createElement("hd-widget-vacuum") as LitElement & {
      hass: HomeAssistant;
      config: WidgetConfig;
      currentSize: WidgetSize;
    };
    element.hass = hass();
    element.config = { ...vacuumConfig, options: { hero: true } };
    element.currentSize = "2x2";
    document.body.appendChild(element);

    await element.updateComplete;

    expect(element.shadowRoot?.querySelector(".hero")).not.toBeNull();
  });

  it("forwards the container layout through the independent fan module", async () => {
    await FAN_WIDGET_DEFINITION.load();
    const element = document.createElement("hd-widget-fan") as LitElement & {
      hass: HomeAssistant;
      config: WidgetConfig;
      currentSize: WidgetSize;
      layout: "row" | "tile" | "value";
    };
    element.hass = hass();
    element.config = fanConfig;
    element.currentSize = "2x1";
    element.layout = "tile";
    document.body.appendChild(element);

    await element.updateComplete;

    const frame = element.shadowRoot?.querySelector("hd-widget-frame") as HTMLElement & {
      layout: string;
    };
    expect(frame.layout).toBe("tile");
  });
});
