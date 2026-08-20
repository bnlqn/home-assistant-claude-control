import { describe, it, expect } from "vitest";
import { mediaProgress } from "./media-progress.js";
import type { HassEntity } from "../types/hass.js";

function entity(attrs: Record<string, unknown>, state = "paused"): HassEntity {
  return {
    entity_id: "media_player.x",
    state,
    attributes: attrs,
    last_changed: "",
    last_updated: "",
    context: { id: "" },
  } as unknown as HassEntity;
}

describe("mediaProgress", () => {
  it("returns null without a usable duration", () => {
    expect(mediaProgress(undefined)).toBeNull();
    expect(mediaProgress(entity({}))).toBeNull();
    expect(mediaProgress(entity({ media_duration: 0 }))).toBeNull();
  });

  it("computes percent, elapsed and total from position/duration", () => {
    const p = mediaProgress(entity({ media_duration: 200, media_position: 50 }));
    expect(p).not.toBeNull();
    expect(p!.pct).toBeCloseTo(25);
    expect(p!.elapsed).toBe("0:50");
    expect(p!.total).toBe("3:20");
  });

  it("advances position while playing and clamps to duration", () => {
    const updated = new Date(Date.now() - 10_000).toISOString(); // 10s ago
    const p = mediaProgress(
      entity({ media_duration: 100, media_position: 30, media_position_updated_at: updated }, "playing"),
    );
    // ~40s in — advanced by the 10s elapsed since the reported position.
    expect(p!.positionSec).toBeGreaterThanOrEqual(39);
    expect(p!.positionSec).toBeLessThanOrEqual(41);

    const done = mediaProgress(
      entity(
        { media_duration: 100, media_position: 95, media_position_updated_at: new Date(Date.now() - 60_000).toISOString() },
        "playing",
      ),
    );
    expect(done!.positionSec).toBe(100); // clamped
    expect(done!.pct).toBe(100);
  });
});
