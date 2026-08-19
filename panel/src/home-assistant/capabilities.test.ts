import { describe, it, expect } from "vitest";
import type { HassEntity } from "../types/hass.js";
import { climateCaps, coverCaps, lightCaps, mediaCaps, vacuumCaps } from "./capabilities.js";

function ent(attrs: Record<string, unknown>, state = "on"): HassEntity {
  return { entity_id: "x.y", state, attributes: attrs, last_changed: "", last_updated: "" };
}

describe("capability detection is feature-driven", () => {
  it("light caps derive from supported_color_modes + effect feature", () => {
    const caps = lightCaps(ent({ supported_color_modes: ["color_temp", "xy"], supported_features: 4 }));
    expect(caps.brightness).toBe(true);
    expect(caps.colorTemp).toBe(true);
    expect(caps.color).toBe(true);
    expect(caps.effects).toBe(true);
  });

  it("an onoff-only light exposes no brightness/color", () => {
    const caps = lightCaps(ent({ supported_color_modes: ["onoff"], supported_features: 0 }));
    expect(caps.brightness).toBe(false);
    expect(caps.color).toBe(false);
    expect(caps.colorTemp).toBe(false);
  });

  it("decodes the real Airco climate features (441)", () => {
    // 441 = target_temp(1) + fan_mode(8) + preset(16) + swing(32) + turn_off(128) + turn_on(256)
    const caps = climateCaps(ent({ supported_features: 441 }, "cool"));
    expect(caps.targetTemp).toBe(true);
    expect(caps.fanMode).toBe(true);
    expect(caps.presetMode).toBe(true);
    expect(caps.swingMode).toBe(true);
    expect(caps.targetTempRange).toBe(false);
    expect(caps.humidity).toBe(false);
  });

  it("decodes Tesla climate (401 = target_temp + preset + on + off, no fan/swing)", () => {
    const caps = climateCaps(ent({ supported_features: 401 }, "off"));
    expect(caps.targetTemp).toBe(true);
    expect(caps.presetMode).toBe(true);
    expect(caps.fanMode).toBe(false);
    expect(caps.swingMode).toBe(false);
  });

  it("cover with open+close only (3) exposes no position/tilt", () => {
    const caps = coverCaps(ent({ supported_features: 3 }, "closed"));
    expect(caps.open).toBe(true);
    expect(caps.close).toBe(true);
    expect(caps.setPosition).toBe(false);
    expect(caps.tilt).toBe(false);
  });

  it("media caps read the feature bitmask", () => {
    // play(16384)+pause(1)+next(32)+previous(16)+volume_set(4)+select_source(2048)
    const caps = mediaCaps(ent({ supported_features: 16384 + 1 + 32 + 16 + 4 + 2048 }, "playing"));
    expect(caps.play).toBe(true);
    expect(caps.pause).toBe(true);
    expect(caps.next).toBe(true);
    expect(caps.previous).toBe(true);
    expect(caps.volumeSet).toBe(true);
    expect(caps.selectSource).toBe(true);
  });

  it("vacuum start capability is detected", () => {
    const caps = vacuumCaps(ent({ supported_features: 30524 }, "docked"));
    expect(caps.start).toBe(true);
    expect(caps.returnHome).toBe(true);
    expect(caps.fanSpeed).toBe(true);
  });
});
