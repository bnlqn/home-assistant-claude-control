import { describe, expect, it } from "vitest";
import {
  currentEnergyPeriodSelection,
  energyStatisticIds,
  resolveEnergyPeriod,
  shiftEnergyPeriod,
  sumStatistic,
} from "./energy-period.js";

describe("Energy period selection", () => {
  const now = new Date(2026, 7, 21, 14, 30);

  it("defaults to the current local day", () => {
    const selection = currentEnergyPeriodSelection(now);
    const range = resolveEnergyPeriod(selection, now);

    expect(selection).toEqual({ period: "day", anchor: "2026-08-21" });
    expect(range.start).toEqual(new Date(2026, 7, 21));
    expect(range.end).toEqual(new Date(2026, 7, 22));
    expect(range.statisticPeriod).toBe("hour");
    expect(range.isCurrent).toBe(true);
    expect(range.label).toBe("Today");
  });

  it("aligns weeks to Monday and months to their calendar boundaries", () => {
    const week = resolveEnergyPeriod({ period: "week", anchor: "2026-08-21" }, now);
    const month = resolveEnergyPeriod({ period: "month", anchor: "2026-08-21" }, now);

    expect(week.start).toEqual(new Date(2026, 7, 17));
    expect(week.end).toEqual(new Date(2026, 7, 24));
    expect(week.statisticPeriod).toBe("day");
    expect(month.start).toEqual(new Date(2026, 7, 1));
    expect(month.end).toEqual(new Date(2026, 8, 1));
  });

  it("moves through days, ISO weeks, and months without mutating the source", () => {
    const day = { period: "day", anchor: "2026-08-21" } as const;
    expect(shiftEnergyPeriod(day, -1)).toEqual({ period: "day", anchor: "2026-08-20" });
    expect(shiftEnergyPeriod({ period: "week", anchor: "2026-08-21" }, -1)).toEqual({
      period: "week",
      anchor: "2026-08-14",
    });
    expect(shiftEnergyPeriod({ period: "month", anchor: "2026-03-31" }, -1)).toEqual({
      period: "month",
      anchor: "2026-02-01",
    });
    expect(day.anchor).toBe("2026-08-21");
  });

  it("falls back safely from an invalid anchor", () => {
    const range = resolveEnergyPeriod({ period: "day", anchor: "2026-02-31" }, now);
    expect(range.selection.anchor).toBe("2026-08-21");
  });

  it("distinguishes missing statistics from a real zero", () => {
    expect(sumStatistic({}, "sensor.missing")).toBeNull();
    expect(sumStatistic({ "sensor.zero": [{ start: 1, change: 0 }] }, "sensor.zero")).toBe(0);
    expect(sumStatistic({ "sensor.energy": [
      { start: 1, change: 2.4 },
      { start: 2, change: 1.6 },
    ] }, "sensor.energy")).toBe(4);
  });

  it("deduplicates recorder ids across the hero and historical widgets", () => {
    expect(energyStatisticIds({
      id: "energy",
      type: "system",
      label: "Energy",
      icon: "mdi:flash",
      hero: {
        type: "energy",
        grid: "sensor.grid_today",
        solar: "sensor.solar_today",
        gridPower: "sensor.grid_power",
        solarPower: "sensor.solar_power",
        statistics: {
          gridImport: "sensor.grid_import",
          gridExport: "sensor.grid_export",
          solar: "sensor.solar_total",
        },
      },
      widgets: [{
        id: "total",
        type: "electricitytotal",
        options: {
          importEnergy: "sensor.grid_import",
          exportEnergy: "sensor.grid_export",
        },
        size: { compact: "4x2", medium: "4x2", wide: "4x2" },
      }],
    })).toEqual([
      "sensor.grid_export",
      "sensor.grid_import",
      "sensor.solar_total",
    ]);
  });
});
