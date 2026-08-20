import { describe, it, expect, vi } from "vitest";
import type { HomeAssistant } from "../types/hass.js";
import { bucketLabel, fetchStatistics, normalizeStatistics, statisticsRange } from "./statistics.js";

describe("normalizeStatistics", () => {
  it("keeps numeric starts, parses ISO starts, and zeroes non-finite change", () => {
    const out = normalizeStatistics({
      "sensor.a": [
        { start: 1_700_000_000_000, change: 1.5 },
        { start: "2026-01-01T00:00:00.000Z", change: null },
        { start: 1_700_100_000_000, change: 3 },
      ],
    });
    expect(out["sensor.a"][0]).toEqual({ start: 1_700_000_000_000, change: 1.5 });
    expect(out["sensor.a"][1]).toEqual({ start: Date.parse("2026-01-01T00:00:00.000Z"), change: 0 });
    expect(out["sensor.a"][2].change).toBe(3);
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
});
