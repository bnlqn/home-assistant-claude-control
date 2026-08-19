import { describe, it, expect } from "vitest";
import type { HassEntity } from "../types/hass.js";
import { computeFlows, isCarActive, isCarConnected, toWatts } from "./energy-flow.js";

function ent(state: string, unit?: string): HassEntity {
  return {
    entity_id: "sensor.x",
    state,
    attributes: unit ? { unit_of_measurement: unit } : {},
    last_changed: "",
    last_updated: "",
  };
}

describe("toWatts", () => {
  it("passes through watts", () => {
    expect(toWatts(ent("542", "W"))).toBe(542);
    expect(toWatts(ent("-192", "W"))).toBe(-192);
  });
  it("normalizes kW → W (Tesla sensors report kW)", () => {
    expect(toWatts(ent("7.4", "kW"))).toBeCloseTo(7400);
    expect(toWatts(ent("0.0052", "kW"))).toBeCloseTo(5.2);
  });
  it("returns null for unavailable / non-numeric", () => {
    expect(toWatts(ent("unavailable", "W"))).toBeNull();
    expect(toWatts(ent("unknown"))).toBeNull();
    expect(toWatts(undefined)).toBeNull();
  });
});

describe("computeFlows", () => {
  it("import only (no solar, no car)", () => {
    const m = computeFlows({ grid: 500, solar: 0, car: 0, carActive: false });
    expect(m.grid.mode).toBe("import");
    expect(m.paths.gridHouse.direction).toBe("toHouse");
    expect(m.paths.gridHouse.watts).toBe(500);
    expect(m.paths.gridHouse.source).toBe("grid");
    expect(m.solar.active).toBe(false);
    expect(m.house.watts).toBe(500);
    expect(m.selfSufficiency).toBe(0); // running entirely on grid
  });

  it("export with solar — the live −192 W / 542 W case (house ≈ 350)", () => {
    const m = computeFlows({ grid: -192, solar: 542, car: 0, carActive: false });
    expect(m.grid.mode).toBe("export");
    expect(m.paths.gridHouse.direction).toBe("toGrid");
    expect(m.paths.gridHouse.watts).toBe(192);
    expect(m.paths.gridHouse.source).toBe("solar");
    expect(m.paths.solarHouse.active).toBe(true);
    expect(m.paths.solarHouse.watts).toBe(542);
    expect(m.house.watts).toBe(350);
    expect(m.selfSufficiency).toBe(100); // solar fully covers the house while exporting
  });

  it("car charging on solar surplus", () => {
    const m = computeFlows({ grid: -100, solar: 3000, car: 2000, carActive: true });
    expect(m.house.watts).toBe(900); // 3000 - 100 - 2000
    expect(m.paths.houseCar.active).toBe(true);
    expect(m.paths.houseCar.watts).toBe(2000);
    expect(m.paths.houseCar.source).toBe("solar");
  });

  it("car charging from the grid clamps house load to 0", () => {
    const m = computeFlows({ grid: 5000, solar: 0, car: 7000, carActive: true });
    expect(m.house.watts).toBe(0); // 0 + 5000 - 7000, clamped
    expect(m.paths.houseCar.source).toBe("grid");
    expect(m.paths.gridHouse.direction).toBe("toHouse");
    expect(m.paths.gridHouse.watts).toBe(5000);
  });

  it("ignores car power when the car is not active", () => {
    const m = computeFlows({ grid: 200, solar: 0, car: 5000, carActive: false, carConnected: true });
    expect(m.car.watts).toBe(0);
    expect(m.paths.houseCar.active).toBe(false);
    expect(m.car.connected).toBe(true); // still shown, just dim
    expect(m.house.watts).toBe(200);
  });

  it("near-balanced readings are idle (deadband)", () => {
    const m = computeFlows({ grid: 10, solar: 5, car: 0, carActive: false });
    expect(m.grid.mode).toBe("idle");
    expect(m.paths.gridHouse.active).toBe(false);
    expect(m.paths.solarHouse.active).toBe(false);
  });

  it("treats null (unavailable) readings as zero without crashing", () => {
    const m = computeFlows({ grid: null, solar: null, car: null, carActive: false });
    expect(m.house.watts).toBe(0);
    expect(m.grid.mode).toBe("idle");
    expect(m.solar.active).toBe(false);
  });
});

describe("car status interpretation", () => {
  it("detects active charging", () => {
    expect(isCarActive("charging")).toBe(true);
    expect(isCarActive("Starting")).toBe(true);
    expect(isCarActive("connected")).toBe(false);
    expect(isCarActive("not_connected")).toBe(false);
    expect(isCarActive(undefined)).toBe(false);
  });
  it("detects connection", () => {
    expect(isCarConnected("charging")).toBe(true);
    expect(isCarConnected("connected")).toBe(true);
    expect(isCarConnected("not_connected")).toBe(false);
    expect(isCarConnected("disconnected")).toBe(false);
  });
});
