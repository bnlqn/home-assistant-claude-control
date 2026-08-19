import { describe, it, expect } from "vitest";
import { normalizeStatistics, statisticsRange, bucketLabel } from "./statistics.js";

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
});

describe("statisticsRange", () => {
  const now = new Date(2026, 7, 19, 14, 30); // Wed 19 Aug 2026, local

  it("day period starts N-1 midnights back", () => {
    const start = statisticsRange("day", 7, now);
    expect(start).toEqual(new Date(2026, 7, 13, 0, 0, 0, 0));
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
    expect(bucketLabel(ms, "day")).not.toBe("");
    expect(bucketLabel(ms, "week")).not.toBe("");
    expect(bucketLabel(ms, "month")).not.toBe("");
  });
});
