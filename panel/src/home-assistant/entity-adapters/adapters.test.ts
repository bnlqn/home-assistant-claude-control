import { describe, it, expect } from "vitest";
import type { HassEntities, HassEntity, HomeAssistant } from "../../types/hass.js";
import { normalizeEntity, accentVars } from "./index.js";

function hassWith(states: Record<string, Partial<HassEntity> & { state: string }>): HomeAssistant {
  const full: HassEntities = {};
  for (const [id, s] of Object.entries(states)) {
    full[id] = {
      entity_id: id,
      state: s.state,
      attributes: s.attributes ?? {},
      last_changed: s.last_changed ?? new Date().toISOString(),
      last_updated: s.last_updated ?? new Date().toISOString(),
    };
  }
  return { states: full, connected: true } as unknown as HomeAssistant;
}

describe("normalizeEntity", () => {
  it("normalizes an on light with brightness + rgb", () => {
    const hass = hassWith({
      "light.a": {
        state: "on",
        attributes: {
          friendly_name: "Lamp",
          brightness: 128,
          color_mode: "xy",
          rgb_color: [255, 100, 0],
          supported_color_modes: ["xy"],
        },
      },
    });
    const vm = normalizeEntity(hass, "light.a");
    expect(vm.active).toBe(true);
    expect(vm.accent).toBe("light");
    expect(vm.level).toBe(50); // 128/255 ≈ 50%
    expect(vm.rgbCss).toBe("rgb(255, 100, 0)");
    expect(vm.quickAction.kind).toBe("toggle");
  });

  it("marks an off light idle", () => {
    const hass = hassWith({ "light.a": { state: "off", attributes: { supported_color_modes: ["brightness"] } } });
    const vm = normalizeEntity(hass, "light.a");
    expect(vm.active).toBe(false);
    expect(vm.accent).toBe("idle");
  });

  it("returns an unavailable model for a missing entity (no crash)", () => {
    const vm = normalizeEntity(hassWith({}), "light.ghost");
    expect(vm.exists).toBe(false);
    expect(vm.available).toBe(false);
    expect(vm.accent).toBe("unavailable");
    expect(vm.displayState).toBe("Not found");
  });

  it("flags REPLACE_ME placeholders distinctly", () => {
    const vm = normalizeEntity(hassWith({}), "light.REPLACE_ME");
    expect(vm.isPlaceholder).toBe(true);
  });

  it("colors a cooling thermostat cool and a heating one heat", () => {
    const hass = hassWith({
      "climate.cool": { state: "cool", attributes: { current_temperature: 25, temperature: 21 } },
      "climate.heat": { state: "heat", attributes: { current_temperature: 18, temperature: 22 } },
      "climate.off": { state: "off", attributes: {} },
    });
    expect(normalizeEntity(hass, "climate.cool").accent).toBe("cool");
    expect(normalizeEntity(hass, "climate.heat").accent).toBe("heat");
    expect(normalizeEntity(hass, "climate.off").accent).toBe("idle");
  });

  it("locks are eco when locked, and unlock is confirmation-gated", () => {
    const hass = hassWith({ "lock.a": { state: "locked", attributes: {} } });
    const vm = normalizeEntity(hass, "lock.a");
    expect(vm.accent).toBe("eco");
    expect(vm.quickAction.label).toBe("Unlock");
    expect(vm.quickAction.requiresConfirmation).toBe(true);
  });

  it("battery sensor warns when low", () => {
    const hass = hassWith({
      "sensor.b": { state: "9", attributes: { device_class: "battery", unit_of_measurement: "%" } },
    });
    expect(normalizeEntity(hass, "sensor.b").accent).toBe("warn");
  });

  it("unavailable entity is desaturated", () => {
    const hass = hassWith({ "fan.a": { state: "unavailable", attributes: {} } });
    const vm = normalizeEntity(hass, "fan.a");
    expect(vm.available).toBe(false);
    expect(vm.accent).toBe("unavailable");
  });

  it("reads vacuum battery + status from companion sensors, not the vacuum entity", () => {
    const hass = hassWith({
      "vacuum.robo": { state: "docked", attributes: { supported_features: 30524 } },
      "sensor.robo_battery": { state: "80", attributes: { device_class: "battery", unit_of_measurement: "%" } },
      "sensor.robo_status": { state: "charging", attributes: {} },
    });
    const vm = normalizeEntity(hass, "vacuum.robo");
    expect(vm.displayState).toBe("Charging"); // companion status beats bare "docked"
    expect(vm.secondary).toBe("80% battery");
    expect(vm.quickAction.label).toBe("Start");
  });

  it("shows live progress + room while a vacuum is cleaning", () => {
    const hass = hassWith({
      "vacuum.robo": { state: "cleaning", attributes: { supported_features: 30524 } },
      "sensor.robo_current_room": { state: "Kitchen", attributes: {} },
      "sensor.robo_cleaning_progress": { state: "42", attributes: { unit_of_measurement: "%" } },
      "sensor.robo_cleaning_area": { state: "12.5", attributes: { unit_of_measurement: "m²" } },
    });
    const vm = normalizeEntity(hass, "vacuum.robo");
    expect(vm.active).toBe(true);
    expect(vm.accent).toBe("accent");
    expect(vm.displayState).toBe("Cleaning Kitchen");
    expect(vm.secondary).toContain("42%");
    expect(vm.secondary).toContain("12.5 m²");
    expect(vm.level).toBe(42);
  });
});

describe("accentVars", () => {
  it("maps every accent token to fg/bg custom properties", () => {
    for (const token of ["light", "heat", "cool", "eco", "warn", "alert", "accent", "idle", "unavailable"] as const) {
      const v = accentVars(token);
      expect(v.fg).toMatch(/var\(--/);
      expect(v.bg).toMatch(/var\(--/);
    }
  });
});
