import { describe, expect, it } from "vitest";
import type { EnergyHeroConfig } from "../config/schema.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { activeEnergyFlows } from "./energy-hero.js";

const options: EnergyHeroConfig = {
  type: "energy",
  grid: "sensor.grid_today",
  solar: "sensor.solar_today",
  gridPower: "sensor.grid_power",
  solarPower: "sensor.solar_power",
  carConnected: "binary_sensor.car_connected",
  carPower: "sensor.car_power",
};

function entity(entityId: string, state: string, unit?: string): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: unit ? { unit_of_measurement: unit } : {},
    last_changed: "",
    last_updated: "",
  };
}

function hass(values: Record<string, [string, string?]>): HomeAssistant {
  const states = Object.fromEntries(
    Object.entries(values).map(([id, [state, unit]]) => [id, entity(id, state, unit)]),
  );
  return { states } as unknown as HomeAssistant;
}

describe("activeEnergyFlows", () => {
  it("selects solar, import, home, and EV layers", () => {
    const state = hass({
      "sensor.grid_power": ["500", "W"],
      "sensor.solar_power": ["2.4", "kW"],
      "sensor.car_power": ["0.5", "kW"],
      "binary_sensor.car_connected": ["on"],
    });

    expect(activeEnergyFlows(state, options)).toEqual([
      "solar-generating",
      "grid-importing",
      "home-consuming",
      "ev-charging",
    ]);
  });

  it("uses the dedicated export animation for negative grid power", () => {
    const state = hass({
      "sensor.grid_power": ["-192", "W"],
      "sensor.solar_power": ["542", "W"],
      "sensor.car_power": ["0", "W"],
      "binary_sensor.car_connected": ["off"],
    });

    expect(activeEnergyFlows(state, options)).toEqual([
      "solar-generating",
      "grid-exporting",
      "home-consuming",
    ]);
  });

  it("returns no layers for unavailable or deadband readings", () => {
    const state = hass({
      "sensor.grid_power": ["unavailable", "W"],
      "sensor.solar_power": ["10", "W"],
      "sensor.car_power": ["unknown", "W"],
      "binary_sensor.car_connected": ["on"],
    });

    expect(activeEnergyFlows(state, options)).toEqual([]);
    expect(activeEnergyFlows(undefined, options)).toEqual([]);
  });
});
