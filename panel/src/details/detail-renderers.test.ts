import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "lit";
import type { WidgetConfig } from "../config/schema.js";
import { COVER_FEATURE, MEDIA_FEATURE, VACUUM_FEATURE } from "../home-assistant/capabilities.js";
import type { ServiceCall } from "../home-assistant/service-calls.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { renderClimateDetail } from "./climate-detail.js";
import type { DetailContext } from "./detail-context.js";
import { renderDetailBody } from "./controllers.js";
import { renderDefinedDetail } from "./detail-registry.js";
import {
  renderPowerflowDetail,
  renderSolarChargingDetail,
} from "./energy-detail.js";
import { renderLightDetail, rgbToHs } from "./light-detail.js";
import { renderSensorDetail, renderWeatherDetail } from "./sensor-detail.js";

const size = { compact: "2x1", medium: "2x1", wide: "2x2" } as const;

function entity(entityId: string, state: string, attributes: Record<string, unknown>): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes,
    last_changed: "2026-08-20T10:00:00Z",
    last_updated: "2026-08-20T10:00:00Z",
  };
}

function context(
  state: HassEntity,
  config: WidgetConfig,
  companions: HassEntity[] = [],
): { ctx: DetailContext; call: ReturnType<typeof vi.fn> } {
  const call = vi.fn<(serviceCall: ServiceCall, verb?: string) => Promise<void>>()
    .mockResolvedValue(undefined);
  const states = [state, ...companions];
  const hass = {
    states: Object.fromEntries(states.map((item) => [item.entity_id, item])),
    connected: true,
  } as unknown as HomeAssistant;
  return {
    call,
    ctx: {
      hass,
      entityId: state.entity_id,
      config,
      host: document.createElement("div"),
      trend: [],
      forecast: [],
      call,
    },
  };
}

afterEach(() => document.body.replaceChildren());

describe("light detail renderer", () => {
  it("renders capability-driven controls and routes toggle service calls", () => {
    const state = entity("light.test", "on", {
      brightness: 128,
      supported_color_modes: ["hs", "color_temp"],
      supported_features: 4,
      min_color_temp_kelvin: 2200,
      max_color_temp_kelvin: 6500,
      rgb_color: [255, 0, 0],
      effect_list: ["None", "Rainbow"],
    });
    const config: WidgetConfig = {
      id: "light-detail",
      type: "light",
      entity: state.entity_id,
      size,
    };
    const { ctx, call } = context(state, config);
    const container = document.createElement("div");
    document.body.appendChild(container);

    render(renderLightDetail(ctx, state), container);

    expect(container.querySelectorAll("hd-slider")).toHaveLength(2);
    expect(container.querySelector("hd-color-wheel")).not.toBeNull();
    expect(container.querySelectorAll("button.swatch")).toHaveLength(9);
    expect(container.textContent).toContain("Rainbow");

    container.querySelector("hd-toggle")!.dispatchEvent(new CustomEvent("hd-toggle"));
    expect(call).toHaveBeenCalledWith({
      domain: "light",
      service: "toggle",
      data: { entity_id: "light.test" },
    }, "toggle");
  });

  it("keeps colour conversion deterministic", () => {
    expect(rgbToHs([255, 0, 0])).toEqual([0, 100]);
    expect(rgbToHs([0, 255, 0])).toEqual([120, 100]);
    expect(rgbToHs([128, 128, 128])).toEqual([0, 0]);
  });
});

describe("climate detail renderer", () => {
  it("renders registered and fallback routes with companion controls", () => {
    const state = entity("climate.test", "cool", {
      temperature: 20,
      current_temperature: 24,
      target_temp_step: 0.5,
      min_temp: 16,
      max_temp: 30,
      hvac_modes: ["off", "cool"],
      fan_modes: ["auto", "high"],
      swing_modes: ["off", "vertical"],
      preset_modes: ["none", "eco"],
      supported_features: 1 | 8 | 16 | 32,
    });
    const eco = entity("switch.eco", "on", {});
    const config: WidgetConfig = {
      id: "climate-detail",
      type: "climate",
      entity: state.entity_id,
      size,
      options: { switches: [{ entity: eco.entity_id, name: "Economy" }] },
    };
    const { ctx, call } = context(state, config, [eco]);
    const registered = document.createElement("div");
    const fallback = document.createElement("div");
    document.body.append(registered, fallback);

    render(renderDefinedDetail("climate", ctx, state), registered);
    render(renderDetailBody(ctx), fallback);

    expect(registered.querySelectorAll("hd-segmented")).toHaveLength(4);
    expect(registered.querySelectorAll("hd-icon-button")).toHaveLength(2);
    expect(registered.textContent).toContain("Economy");
    expect(fallback.textContent).toContain("Economy");

    registered.querySelectorAll("hd-icon-button")[1]
      .dispatchEvent(new Event("click", { bubbles: true }));
    expect(call).toHaveBeenCalledWith({
      domain: "climate",
      service: "set_temperature",
      data: { entity_id: "climate.test", temperature: 20.5 },
    }, "set temperature for");

    registered.querySelector("hd-toggle")!.dispatchEvent(new CustomEvent("hd-toggle"));
    expect(call).toHaveBeenCalledWith({
      domain: "switch",
      service: "toggle",
      data: { entity_id: "switch.eco" },
    }, "toggle economy");
  });

  it("can render the domain module directly", () => {
    const state = entity("climate.test", "off", {
      hvac_modes: ["off", "heat"],
      supported_features: 1,
    });
    const config: WidgetConfig = {
      id: "climate-direct",
      type: "climate",
      entity: state.entity_id,
      size,
    };
    const { ctx } = context(state, config);
    const container = document.createElement("div");

    render(renderClimateDetail(ctx, state), container);

    expect(container.textContent).toContain("Mode");
    expect(container.textContent).toContain("—");
  });
});

describe("domain detail modules", () => {
  it("keeps media rendering and transport service routing independent", () => {
    const state = entity("media_player.test", "playing", {
      media_title: "Night Drive",
      volume_level: 0.35,
      supported_features: MEDIA_FEATURE.PAUSE |
        MEDIA_FEATURE.PLAY |
        MEDIA_FEATURE.VOLUME_SET,
    });
    const config: WidgetConfig = {
      id: "media-detail",
      type: "media",
      entity: state.entity_id,
      size,
    };
    const { ctx, call } = context(state, config);
    const container = document.createElement("div");

    render(renderDetailBody(ctx), container);

    expect(container.textContent).toContain("Night Drive");
    expect(container.querySelector("hd-slider")).not.toBeNull();
    container.querySelector<HTMLElement>('[label="Play or pause"]')!
      .dispatchEvent(new Event("click", { bubbles: true }));
    expect(call).toHaveBeenCalledWith({
      domain: "media_player",
      service: "media_play_pause",
      data: { entity_id: state.entity_id },
    }, "control");
  });

  it("preserves cover and vacuum capability-driven actions", () => {
    const cover = entity("cover.test", "open", {
      current_position: 64,
      supported_features: COVER_FEATURE.OPEN |
        COVER_FEATURE.CLOSE |
        COVER_FEATURE.STOP |
        COVER_FEATURE.SET_POSITION,
    });
    const coverConfig: WidgetConfig = {
      id: "cover-detail",
      type: "cover",
      entity: cover.entity_id,
      size,
    };
    const coverContext = context(cover, coverConfig);
    const coverContainer = document.createElement("div");
    render(renderDefinedDetail("cover", coverContext.ctx, cover), coverContainer);

    coverContainer.querySelector("hd-slider")!.dispatchEvent(new CustomEvent("hd-change", {
      detail: { value: 42 },
    }));
    expect(coverContext.call).toHaveBeenCalledWith({
      domain: "cover",
      service: "set_cover_position",
      data: { entity_id: cover.entity_id, position: 42 },
    }, "move");

    const vacuum = entity("vacuum.test", "docked", {
      battery_level: 82,
      fan_speed: "balanced",
      fan_speed_list: ["quiet", "balanced"],
      supported_features: VACUUM_FEATURE.START |
        VACUUM_FEATURE.PAUSE |
        VACUUM_FEATURE.RETURN_HOME,
    });
    const vacuumConfig: WidgetConfig = {
      id: "vacuum-detail",
      type: "vacuum",
      entity: vacuum.entity_id,
      size,
    };
    const vacuumContext = context(vacuum, vacuumConfig);
    const vacuumContainer = document.createElement("div");
    render(renderDefinedDetail("vacuum", vacuumContext.ctx, vacuum), vacuumContainer);

    vacuumContainer.querySelector<HTMLButtonElement>("button.bigbtn")!.click();
    expect(vacuumContext.call).toHaveBeenCalledWith({
      domain: "vacuum",
      service: "start",
      data: { entity_id: vacuum.entity_id },
    }, "start");

    const toggle = entity("switch.test", "off", {});
    const toggleConfig: WidgetConfig = {
      id: "switch-detail",
      type: "switch",
      entity: toggle.entity_id,
      size,
    };
    const toggleContext = context(toggle, toggleConfig);
    const toggleContainer = document.createElement("div");
    render(renderDefinedDetail("generic", toggleContext.ctx, toggle), toggleContainer);
    toggleContainer.querySelector<HTMLButtonElement>("button.bigbtn")!.click();
    expect(toggleContext.call).toHaveBeenCalledWith({
      domain: "switch",
      service: "turn_on",
      data: { entity_id: toggle.entity_id },
    }, "turn on");
  });

  it("keeps sensor history and weather forecast rendering in a read-only module", () => {
    const sensor = entity("sensor.temperature", "21.4", {
      friendly_name: "Temperature",
      unit_of_measurement: "°C",
    });
    const sensorConfig: WidgetConfig = {
      id: "sensor-detail",
      type: "sensor",
      entity: sensor.entity_id,
      size,
    };
    const sensorContext = context(sensor, sensorConfig);
    sensorContext.ctx.trend = [19.5, 20.2, 21.4];
    const sensorContainer = document.createElement("div");
    render(renderSensorDetail(sensorContext.ctx, sensor), sensorContainer);
    expect(sensorContainer.textContent).toContain("Last 24 hours");
    expect(sensorContainer.querySelector("hd-trend")).not.toBeNull();

    const weather = entity("weather.test", "partlycloudy", {
      temperature: 20,
      humidity: 58,
    });
    const weatherConfig: WidgetConfig = {
      id: "weather-detail",
      type: "weather",
      entity: weather.entity_id,
      size,
    };
    const weatherContext = context(weather, weatherConfig);
    weatherContext.ctx.forecast = [{
      datetime: "2026-08-21T12:00:00Z",
      condition: "sunny",
      temperature: 24,
      templow: 15,
    }];
    const weatherContainer = document.createElement("div");
    render(renderWeatherDetail(weatherContext.ctx, weather), weatherContainer);
    expect(weatherContainer.textContent).toContain("Forecast");
    expect(weatherContainer.textContent).toContain("24° / 15°");
  });

  it("keeps Energy renderers separate while preserving helper actions", () => {
    const grid = entity("sensor.grid_power", "-900", { unit_of_measurement: "W" });
    const energyConfig: WidgetConfig = {
      id: "energy-detail",
      type: "energy",
      size,
      options: { gridPower: grid.entity_id },
    };
    const energyContext = context(grid, energyConfig);
    const energyContainer = document.createElement("div");
    render(renderDetailBody(energyContext.ctx), energyContainer);
    expect(energyContainer.textContent).toContain("GridPower");

    const flowConfig: WidgetConfig = {
      id: "flow-detail",
      type: "powerflow",
      size: { compact: "2x2", medium: "2x2", wide: "3x3" },
      options: { gridPower: grid.entity_id },
    };
    const flowContext = context(grid, flowConfig);
    const flowContainer = document.createElement("div");
    render(renderPowerflowDetail(flowContext.ctx), flowContainer);
    expect(flowContainer.querySelector("hd-flow-diagram")).not.toBeNull();

    const master = entity("input_boolean.solar_charging", "on", {});
    const solarConfig: WidgetConfig = {
      id: "solar-detail",
      type: "solarcharging",
      size,
      options: { master: master.entity_id },
    };
    const solarContext = context(master, solarConfig);
    const solarContainer = document.createElement("div");
    render(renderSolarChargingDetail(solarContext.ctx), solarContainer);
    solarContainer.querySelector("hd-toggle")!.dispatchEvent(new CustomEvent("hd-toggle"));
    expect(solarContext.call).toHaveBeenCalledWith({
      domain: "input_boolean",
      service: "toggle",
      data: { entity_id: master.entity_id },
    }, "toggle solar charging");
  });
});
