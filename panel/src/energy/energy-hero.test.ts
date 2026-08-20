import { describe, expect, it } from "vitest";
import type { EnergyHeroConfig } from "../config/schema.js";
import type { HassEntity, HomeAssistant } from "../types/hass.js";
import {
  energyStatisticsAvailability,
  resolveEnergyPeriod,
  type EnergyPeriodContext,
} from "./energy-period.js";
import {
  activeEnergyFlows,
  energyHeroTotals,
} from "./energy-hero.js";

const options: EnergyHeroConfig = {
  type: "energy",
  grid: "sensor.grid_today",
  solar: "sensor.solar_today",
  gridPower: "sensor.grid_power",
  solarPower: "sensor.solar_power",
  carConnected: "binary_sensor.car_connected",
  carPower: "sensor.car_power",
  statistics: {
    gridImport: "sensor.grid_import",
    gridExport: "sensor.grid_export",
    solar: "sensor.solar_total",
  },
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

describe("energyHeroTotals", () => {
  it("uses fresh live entities for the current day", () => {
    const state = hass({
      "sensor.grid_today": ["6.6", "kWh"],
      "sensor.solar_today": ["6.4", "kWh"],
    });

    expect(energyHeroTotals(state, options)).toEqual({ grid: 6.6, solar: 6.4, home: 13 });
  });

  it("uses shared recorder statistics for a historical period", () => {
    const range = resolveEnergyPeriod(
      { period: "day", anchor: "2026-08-20" },
      new Date(2026, 7, 21, 12),
    );
    const context: EnergyPeriodContext = {
      range,
      status: "ready",
      metadata: {},
      coverage: "ready",
      coverageById: {},
      statistics: {
        "sensor.grid_import": [{ start: range.start.getTime(), change: 8 }],
        "sensor.grid_export": [{ start: range.start.getTime(), change: 3 }],
        "sensor.solar_total": [{ start: range.start.getTime(), change: 7 }],
      },
    };

    expect(energyHeroTotals(hass({}), options, context)).toEqual({
      grid: 5,
      solar: 7,
      home: 12,
    });
  });

  it.each([
    ["day", "2026-08-20", [3, 5], [1, 2], [4, 3], { grid: 5, solar: 7, home: 12 }],
    ["week", "2026-08-17", [22, 18], [4, 6], [25, 20], { grid: 30, solar: 45, home: 75 }],
    ["month", "2026-07-01", [90, 75], [15, 10], [80, 70], { grid: 140, solar: 150, home: 290 }],
  ] as const)(
    "matches native Energy import/export conventions for a representative %s",
    (period, anchor, imports, exports, solar, expected) => {
      const range = resolveEnergyPeriod(
        { period, anchor },
        new Date("2026-08-21T12:00:00Z"),
        "Europe/Brussels",
      );
      const buckets = (values: readonly number[]) => values.map((change, index) => ({
        start: range.start.getTime() + index * 3_600_000,
        change,
      }));
      const context: EnergyPeriodContext = {
        range,
        status: "ready",
        metadata: {},
        coverage: "ready",
        coverageById: {},
        statistics: {
          "sensor.grid_import": buckets(imports),
          "sensor.grid_export": buckets(exports),
          "sensor.solar_total": buckets(solar),
        },
      };

      expect(energyHeroTotals(hass({}), options, context)).toEqual(expected);
    },
  );

  it("keeps missing recorder data unavailable instead of fabricating zero", () => {
    const range = resolveEnergyPeriod(
      { period: "month", anchor: "2026-07-01" },
      new Date(2026, 7, 21, 12),
    );
    expect(energyHeroTotals(hass({}), options, {
      range,
      status: "ready",
      metadata: {},
      coverage: "unavailable",
      coverageById: {},
      statistics: {},
    })).toEqual({ grid: null, solar: null, home: null });
  });
});

describe("energyStatisticsAvailability", () => {
  const context = (coverage: EnergyPeriodContext["coverage"], status: EnergyPeriodContext["status"] = "ready") => {
    const range = resolveEnergyPeriod(
      { period: "day", anchor: "2026-08-20" },
      new Date("2026-08-21T12:00:00Z"),
      "Europe/Brussels",
    );
    return { range, status, statistics: {}, metadata: {}, coverage, coverageById: {} };
  };

  it("labels partial, unavailable, and loading history", () => {
    expect(energyStatisticsAvailability(context("partial"))).toBe("Partial");
    expect(energyStatisticsAvailability(context("unavailable"))).toBe("Unavailable");
    expect(energyStatisticsAvailability(context("partial", "loading"))).toBe("Loading");
  });

  it("does not label complete historical data", () => {
    expect(energyStatisticsAvailability(context("ready"))).toBeNull();
  });
});
