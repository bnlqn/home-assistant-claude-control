import { describe, it, expect } from "vitest";
import { actualCurve, forecastCurve, startOfLocalDay } from "./solarforecast.js";

const DAY = 24 * 60 * 60 * 1000;
const dayStart = startOfLocalDay(new Date("2026-08-21T09:00:00"));

/** ISO string for a given hour offset into the local test day. */
function at(hour: number): string {
  return new Date(dayStart + hour * 60 * 60 * 1000).toISOString();
}

describe("forecastCurve", () => {
  it("maps datetime/watts to sorted day-fraction points within today", () => {
    const raw = [
      { datetime: at(18), watts: 800 },
      { datetime: at(6), watts: 1200 },
      { datetime: at(12), watts: "4200" },
    ];
    const pts = forecastCurve(raw, dayStart);
    expect(pts.map((p) => p.x)).toEqual([0.25, 0.5, 0.75]);
    expect(pts.map((p) => p.w)).toEqual([1200, 4200, 800]);
  });

  it("drops points outside the local day and malformed rows", () => {
    const raw = [
      { datetime: at(-3), watts: 500 }, // yesterday
      { datetime: at(30), watts: 500 }, // tomorrow
      { datetime: "not-a-date", watts: 500 },
      { datetime: at(10) }, // no watts
      { datetime: at(10), watts: 3000 }, // keeper
    ];
    const pts = forecastCurve(raw, dayStart);
    expect(pts).toEqual([{ x: 10 / 24, w: 3000 }]);
  });

  it("returns [] for a missing or non-array attribute", () => {
    expect(forecastCurve(undefined, dayStart)).toEqual([]);
    expect(forecastCurve("OK", dayStart)).toEqual([]);
  });
});

describe("actualCurve", () => {
  const history = [
    { t: dayStart + 6 * 60 * 60 * 1000, value: 900 },
    { t: dayStart + 9 * 60 * 60 * 1000, value: 2400 },
  ];

  it("appends the live reading at `now` after the last sample", () => {
    const now = dayStart + 12 * 60 * 60 * 1000;
    const pts = actualCurve(history, 3100, dayStart, now);
    expect(pts).toHaveLength(3);
    expect(pts[2]).toEqual({ x: 0.5, w: 3100 });
  });

  it("does not append when live coincides with the last sample", () => {
    const now = history[1].t; // same instant as the last sample
    const pts = actualCurve(history, 2400, dayStart, now);
    expect(pts).toHaveLength(2);
  });

  it("omits the live point when there is no live reading", () => {
    const pts = actualCurve(history, null, dayStart, dayStart + 12 * DAY);
    expect(pts).toHaveLength(2);
  });

  it("keeps only points inside the day window", () => {
    const stale = [{ t: dayStart - DAY, value: 100 }, ...history];
    const pts = actualCurve(stale, null, dayStart, dayStart + 10 * 60 * 60 * 1000);
    expect(pts.every((p) => p.x >= 0 && p.x <= 1)).toBe(true);
    expect(pts).toHaveLength(2);
  });
});
