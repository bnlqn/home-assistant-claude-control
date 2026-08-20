import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "lit";
import type { WidgetConfig } from "../config/schema.js";
import type { ServiceCall } from "../home-assistant/service-calls.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { renderClimateDetail } from "./climate-detail.js";
import type { DetailContext } from "./detail-context.js";
import { renderDetailBody } from "./controllers.js";
import { renderDefinedDetail } from "./detail-registry.js";
import { renderLightDetail, rgbToHs } from "./light-detail.js";

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
