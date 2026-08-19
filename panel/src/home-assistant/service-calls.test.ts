import { describe, it, expect } from "vitest";
import {
  buildClimateTemperature,
  buildCoverPosition,
  buildLightBrightness,
  buildLightTurnOn,
  buildMediaSelectSoundMode,
  buildMediaVolume,
  buildNumberSet,
  buildSceneActivate,
  buildToggle,
  buildTurnOff,
} from "./service-calls.js";

describe("service payload construction", () => {
  it("toggles via the domain's own service when it has one", () => {
    expect(buildToggle("light.a")).toMatchObject({ domain: "light", service: "toggle" });
    expect(buildToggle("switch.a").domain).toBe("switch");
  });

  it("falls back to homeassistant.toggle for domains without one", () => {
    // lock has no toggle service
    expect(buildToggle("lock.a")).toMatchObject({ domain: "homeassistant", service: "toggle" });
  });

  it("brightness 0 turns the light off", () => {
    const call = buildLightBrightness("light.a", 0);
    expect(call.service).toBe("turn_off");
  });

  it("brightness clamps to 0..100 and uses brightness_pct", () => {
    const call = buildLightBrightness("light.a", 250);
    expect(call.data?.brightness_pct).toBe(100);
  });

  it("light turn_on maps color temp + rgb + effect", () => {
    const call = buildLightTurnOn("light.a", { colorTempKelvin: 3000.4, rgbColor: [1, 2, 3], effect: "fire" });
    expect(call.data).toMatchObject({ color_temp_kelvin: 3000, rgb_color: [1, 2, 3], effect: "fire" });
  });

  it("media select_sound_mode carries the entity + sound_mode", () => {
    expect(buildMediaSelectSoundMode("media_player.ht", "Cinema")).toMatchObject({
      domain: "media_player",
      service: "select_sound_mode",
      data: { entity_id: "media_player.ht", sound_mode: "Cinema" },
    });
  });

  it("number set_value routes input_number vs number by domain", () => {
    expect(buildNumberSet("input_number.threshold", -1300)).toMatchObject({
      domain: "input_number",
      service: "set_value",
      data: { entity_id: "input_number.threshold", value: -1300 },
    });
    expect(buildNumberSet("number.charge_limit", 80).domain).toBe("number");
  });

  it("climate set_temperature carries the entity + temperature", () => {
    expect(buildClimateTemperature("climate.a", 21.5).data).toMatchObject({
      entity_id: "climate.a",
      temperature: 21.5,
    });
  });

  it("cover position clamps 0..100 and rounds", () => {
    expect(buildCoverPosition("cover.a", 142.7).data?.position).toBe(100);
    expect(buildCoverPosition("cover.a", -5).data?.position).toBe(0);
  });

  it("media volume clamps to 0..1", () => {
    expect(buildMediaVolume("media_player.a", 2).data?.volume_level).toBe(1);
    expect(buildMediaVolume("media_player.a", -1).data?.volume_level).toBe(0);
  });

  it("scene activation uses scene.turn_on", () => {
    expect(buildSceneActivate("scene.movie")).toMatchObject({ domain: "scene", service: "turn_on" });
  });

  it("turn_off routes non-standard domains through homeassistant", () => {
    expect(buildTurnOff("vacuum.a").domain).toBe("homeassistant");
    expect(buildTurnOff("light.a").domain).toBe("light");
  });
});
