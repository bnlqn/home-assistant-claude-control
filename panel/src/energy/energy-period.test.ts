import { describe, expect, it } from "vitest";
import {
  currentEnergyPeriodSelection,
  energyExpectedBucketStarts,
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

  it("uses Home Assistant's timezone instead of the browser calendar", () => {
    const instant = new Date("2026-08-21T22:30:00.000Z");
    expect(currentEnergyPeriodSelection(instant, "Europe/Brussels")).toEqual({
      period: "day",
      anchor: "2026-08-22",
    });
    expect(currentEnergyPeriodSelection(instant, "America/New_York")).toEqual({
      period: "day",
      anchor: "2026-08-21",
    });
  });

  it("resolves 23-hour and 25-hour days across Brussels DST", () => {
    const spring = resolveEnergyPeriod(
      { period: "day", anchor: "2026-03-29" },
      new Date("2026-03-29T12:00:00.000Z"),
      "Europe/Brussels",
    );
    const autumn = resolveEnergyPeriod(
      { period: "day", anchor: "2026-10-25" },
      new Date("2026-10-25T12:00:00.000Z"),
      "Europe/Brussels",
    );

    expect(spring.start.toISOString()).toBe("2026-03-28T23:00:00.000Z");
    expect(spring.end.toISOString()).toBe("2026-03-29T22:00:00.000Z");
    expect(spring.end.getTime() - spring.start.getTime()).toBe(23 * 60 * 60 * 1000);
    expect(autumn.start.toISOString()).toBe("2026-10-24T22:00:00.000Z");
    expect(autumn.end.toISOString()).toBe("2026-10-25T23:00:00.000Z");
    expect(autumn.end.getTime() - autumn.start.getTime()).toBe(25 * 60 * 60 * 1000);
    expect(energyExpectedBucketStarts(spring, spring.end)).toHaveLength(23);
    expect(energyExpectedBucketStarts(autumn, autumn.end)).toHaveLength(25);
  });

  it("expects only elapsed buckets for an incomplete current period", () => {
    const range = resolveEnergyPeriod(
      { period: "day", anchor: "2026-08-21" },
      new Date("2026-08-21T12:30:00.000Z"),
      "Europe/Brussels",
    );
    expect(energyExpectedBucketStarts(range, new Date("2026-08-21T12:30:00.000Z"))).toHaveLength(15);
  });

  it("falls back safely when HA exposes an invalid timezone", () => {
    expect(() => resolveEnergyPeriod(
      { period: "day", anchor: "2026-08-21" },
      now,
      "Mars/Olympus_Mons",
    )).not.toThrow();
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
