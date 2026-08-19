import { describe, it, expect } from "vitest";
import { formatDuration, formatNumber, formatState, relativeTime, titleCase } from "./state-formatting.js";
import type { HassEntity } from "../types/hass.js";

describe("formatting helpers", () => {
  it("rounds numbers by magnitude", () => {
    expect(formatNumber(1234.56)).not.toContain("."); // >=100 → 0 decimals
    expect(formatNumber(5.234)).toContain("5");
  });

  it("formats durations as mm:ss and h:mm:ss", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(3661)).toBe("1:01:01");
    expect(formatDuration(-5)).toBe("0:00");
  });

  it("title-cases underscored state strings", () => {
    expect(titleCase("not_connected")).toBe("Not Connected");
  });

  it("gives 'just now' for recent times", () => {
    expect(relativeTime(new Date().toISOString())).toBe("just now");
  });

  it("localFormat adds a unit for numeric sensors", () => {
    const s: HassEntity = {
      entity_id: "sensor.p",
      state: "196",
      attributes: { unit_of_measurement: "W" },
      last_changed: "",
      last_updated: "",
    };
    expect(formatState(undefined, s)).toContain("W");
  });

  it("handles unavailable/unknown gracefully", () => {
    const mk = (state: string): HassEntity => ({
      entity_id: "x.y",
      state,
      attributes: {},
      last_changed: "",
      last_updated: "",
    });
    expect(formatState(undefined, mk("unavailable"))).toBe("Unavailable");
    expect(formatState(undefined, mk("unknown"))).toBe("Unknown");
  });
});
