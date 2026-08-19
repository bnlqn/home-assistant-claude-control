import { describe, it, expect } from "vitest";
import { buildSolarChargingModel, type SolarChargingOptions } from "./solarcharging.js";
import type { HomeAssistant } from "../types/hass.js";

const OPTS: SolarChargingOptions = {
  master: "input_boolean.solar",
  vehicleConnected: "binary_sensor.connected",
  chargingState: "sensor.charging",
  chargePower: "sensor.power",
  battery: "sensor.battery",
  chargeLimit: "number.limit",
  sessionEnergy: "sensor.session",
  chargeRate: "sensor.rate",
  chargeCurrent: "number.current",
};

/** Minimal hass — the model reads only `states[id].state`. */
function hassOf(states: Record<string, string>): HomeAssistant {
  const map: Record<string, { state: string; attributes: Record<string, unknown> }> = {};
  for (const [id, state] of Object.entries(states)) map[id] = { state, attributes: {} };
  return { states: map } as unknown as HomeAssistant;
}

const BASE = {
  "input_boolean.solar": "on",
  "binary_sensor.connected": "on",
  "sensor.charging": "charging",
  "sensor.power": "3.2",
  "sensor.battery": "55",
  "number.limit": "80",
  "sensor.session": "4.6",
  "sensor.rate": "22",
  "number.current": "7",
};

describe("buildSolarChargingModel", () => {
  it("armed + charging reads as solar charging (eco) with live values", () => {
    const m = buildSolarChargingModel(hassOf(BASE), OPTS);
    expect(m.phase).toBe("charging");
    expect(m.tone).toBe("eco");
    expect(m.label).toBe("Solar charging · 3.2 kW");
    expect(m).toMatchObject({ armed: true, connected: true, batteryPct: 55, limitPct: 80, powerKw: 3.2, currentA: 7 });
  });

  it("charging while NOT armed is a plain (accent) charge, not solar", () => {
    const m = buildSolarChargingModel(hassOf({ ...BASE, "input_boolean.solar": "off" }), OPTS);
    expect(m.phase).toBe("charging");
    expect(m.tone).toBe("accent");
    expect(m.label).toBe("Charging · 3.2 kW");
  });

  it("detects charging from power even when the enum still says stopped", () => {
    const m = buildSolarChargingModel(hassOf({ ...BASE, "sensor.charging": "stopped", "sensor.power": "2.0" }), OPTS);
    expect(m.phase).toBe("charging");
  });

  it("armed + connected + idle reads as waiting for surplus", () => {
    const m = buildSolarChargingModel(hassOf({ ...BASE, "sensor.charging": "stopped", "sensor.power": "0" }), OPTS);
    expect(m.phase).toBe("waiting");
    expect(m.tone).toBe("accent");
  });

  it("not armed + connected + idle reads as solar mode off", () => {
    const m = buildSolarChargingModel(
      hassOf({ ...BASE, "input_boolean.solar": "off", "sensor.charging": "stopped", "sensor.power": "0" }),
      OPTS,
    );
    expect(m.phase).toBe("off");
    expect(m.tone).toBe("neutral");
  });

  it("unplugged trumps everything", () => {
    const m = buildSolarChargingModel(hassOf({ ...BASE, "binary_sensor.connected": "off" }), OPTS);
    expect(m.phase).toBe("unplugged");
    expect(m.label).toBe("Car not connected");
  });

  it("complete state is reported (eco)", () => {
    const m = buildSolarChargingModel(hassOf({ ...BASE, "sensor.charging": "complete", "sensor.power": "0" }), OPTS);
    expect(m.phase).toBe("complete");
    expect(m.tone).toBe("eco");
  });

  it("missing entities degrade to nulls without throwing", () => {
    const m = buildSolarChargingModel(hassOf({}), OPTS);
    expect(m).toMatchObject({ armed: false, connected: false, phase: "unplugged", powerKw: null, batteryPct: null });
  });

  it("tolerates an undefined hass", () => {
    const m = buildSolarChargingModel(undefined, OPTS);
    expect(m.phase).toBe("unplugged");
  });
});
