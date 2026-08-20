import { describe, it, expect, vi } from "vitest";
import type { HomeAssistant } from "../types/hass.js";
import {
  assessEnergyStatistics,
  bucketLabel,
  fetchEnergyStatistics,
  fetchStatistics,
  normalizeStatistics,
  StatisticsRangeCache,
  statisticsRange,
  type EnergyStatisticsData,
  type StatisticMetadata,
} from "./statistics.js";

describe("normalizeStatistics", () => {
  it("keeps finite changes and drops missing recorder values", () => {
    const out = normalizeStatistics({
      "sensor.a": [
        { start: 1_700_000_000_000, change: 1.5 },
        { start: "2026-01-01T00:00:00.000Z", change: null },
        { start: 1_700_100_000_000, change: 3 },
      ],
    });
    expect(out["sensor.a"]).toEqual([
      { start: 1_700_000_000_000, change: 1.5 },
      { start: 1_700_100_000_000, change: 3 },
    ]);
  });

  it("handles an empty/undefined response", () => {
    expect(normalizeStatistics(undefined)).toEqual({});
    expect(normalizeStatistics({ "sensor.a": [] })).toEqual({ "sensor.a": [] });
  });

  it("drops rows with invalid start timestamps", () => {
    expect(normalizeStatistics({ "sensor.a": [{ start: "not-a-date", change: 2 }] })).toEqual({
      "sensor.a": [],
    });
  });
});

const metadata = (id: string): StatisticMetadata => ({
  statistic_id: id,
  source: "recorder",
  name: null,
  unit_class: "energy",
  statistics_unit_of_measurement: "Wh",
  display_unit_of_measurement: "kWh",
  has_sum: true,
  has_mean: false,
});

describe("assessEnergyStatistics", () => {
  it("distinguishes ready, partial, unavailable, and negative-reset data", () => {
    const ids = ["sensor.ready", "sensor.partial", "sensor.missing", "sensor.reset"];
    const result = assessEnergyStatistics(ids, {
      "sensor.ready": [{ start: 1, change: 2 }, { start: 2, change: 3 }],
      "sensor.partial": [{ start: 1, change: 1 }],
      "sensor.reset": [{ start: 1, change: -4 }, { start: 2, change: 2 }],
    }, Object.fromEntries(ids.map((id) => [id, metadata(id)])), [1, 2]);

    expect(result.coverage).toBe("partial");
    expect(result.coverageById).toEqual({
      "sensor.ready": "ready",
      "sensor.partial": "partial",
      "sensor.missing": "unavailable",
      "sensor.reset": "partial",
    });
    expect(result.statistics["sensor.reset"]).toEqual([{ start: 2, change: 2 }]);
  });

  it("requires energy sum metadata before calling a complete series ready", () => {
    const result = assessEnergyStatistics(
      ["sensor.energy"],
      { "sensor.energy": [{ start: 1, change: 2 }] },
      { "sensor.energy": { ...metadata("sensor.energy"), has_sum: false } },
      [1],
    );
    expect(result.coverage).toBe("partial");
  });
});

describe("statisticsRange", () => {
  const now = new Date(2026, 7, 19, 14, 30); // Wed 19 Aug 2026, local

  it("day period starts N-1 midnights back", () => {
    const start = statisticsRange("day", 7, now);
    expect(start).toEqual(new Date(2026, 7, 13, 0, 0, 0, 0));
  });

  it("hour period starts N-1 aligned hours back", () => {
    expect(statisticsRange("hour", 3, now)).toEqual(new Date(2026, 7, 19, 12));
  });

  it("month period starts on the first of the month N-1 months back", () => {
    const start = statisticsRange("month", 12, now);
    expect(start).toEqual(new Date(2025, 8, 1, 0, 0, 0, 0)); // Sep 2025
  });

  it("week period lands on a Monday", () => {
    const start = statisticsRange("week", 8, now);
    expect(start.getDay()).toBe(1); // Monday
    expect(start.getHours()).toBe(0);
  });
});

describe("bucketLabel", () => {
  it("returns empty string for an invalid timestamp", () => {
    expect(bucketLabel(Number.NaN, "day")).toBe("");
  });
  it("produces a non-empty label per period", () => {
    const ms = new Date(2026, 7, 17).getTime();
    expect(bucketLabel(ms, "hour")).not.toBe("");
    expect(bucketLabel(ms, "day")).not.toBe("");
    expect(bucketLabel(ms, "week")).not.toBe("");
    expect(bucketLabel(ms, "month")).not.toBe("");
  });
});

describe("fetchStatistics", () => {
  it("sends an explicit end bound and removes out-of-range recorder rows", async () => {
    const start = new Date("2026-08-20T00:00:00.000Z");
    const end = new Date("2026-08-21T00:00:00.000Z");
    const callWS = vi.fn(async () => ({
      "sensor.energy": [
        { start: start.getTime() - 3_600_000, change: 99 },
        { start: start.getTime(), change: 2 },
        { start: end.getTime(), change: 3 },
      ],
    }));
    const hass = { callWS } as unknown as HomeAssistant;

    const result = await fetchStatistics(hass, ["sensor.energy"], "hour", start, end);

    expect(callWS).toHaveBeenCalledWith(expect.objectContaining({
      type: "recorder/statistics_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      period: "hour",
    }));
    expect(result).toEqual({
      "sensor.energy": [{ start: start.getTime(), change: 2 }],
    });
  });

  it("requests kWh conversion and metadata for Energy period data", async () => {
    const start = new Date("2026-08-20T00:00:00.000Z");
    const end = new Date("2026-08-20T01:00:00.000Z");
    const callWS = vi.fn(async (message: Record<string, unknown>) => {
      if (message.type === "recorder/get_statistics_metadata") return [metadata("sensor.energy")];
      return { "sensor.energy": [{ start: start.getTime(), change: 1.25 }] };
    });
    const hass = { callWS } as unknown as HomeAssistant;

    const result = await fetchEnergyStatistics(
      hass,
      ["sensor.energy"],
      "hour",
      start,
      end,
      [start.getTime()],
    );

    expect(result.coverage).toBe("ready");
    expect(callWS).toHaveBeenCalledWith(expect.objectContaining({
      type: "recorder/statistics_during_period",
      units: { energy: "kWh" },
    }));
    expect(callWS).toHaveBeenCalledWith({
      type: "recorder/get_statistics_metadata",
      statistic_ids: ["sensor.energy"],
    });
  });
});

describe("StatisticsRangeCache", () => {
  const value = (change: number): EnergyStatisticsData => ({
    statistics: { test: [{ start: 1, change }] },
    metadata: {},
    coverage: "ready",
    coverageById: { test: "ready" },
  });

  it("keeps a bounded least-recently-used set of historical ranges", () => {
    const cache = new StatisticsRangeCache(2);
    cache.set("first", value(1));
    cache.set("second", value(2));
    expect(cache.get("first")?.statistics.test[0].change).toBe(1);
    cache.set("third", value(3));

    expect(cache.size).toBe(2);
    expect(cache.get("second")).toBeUndefined();
    expect(cache.get("first")).toBeDefined();
    expect(cache.get("third")).toBeDefined();
  });
});
