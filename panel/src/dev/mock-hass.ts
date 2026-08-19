import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { DEMO_STATES } from "../testing/fixtures/states.js";

/**
 * A self-contained mock `hass` for the Vite dev harness and for interaction
 * tests. It applies optimistic mutations on `callService` so the panel is fully
 * interactive offline, and serves synthetic history / weather-forecast data.
 * Never shipped to Home Assistant.
 */
export class MockHassController {
  private states: Record<string, HassEntity>;
  /** undefined → let the panel follow the OS `prefers-color-scheme`. */
  darkMode: boolean | undefined = undefined;
  connected = true;
  private listeners = new Set<() => void>();

  constructor(seed: Record<string, HassEntity> = DEMO_STATES) {
    // Deep-ish clone so tests don't mutate the shared fixture.
    this.states = Object.fromEntries(
      Object.entries(seed).map(([id, s]) => [id, { ...s, attributes: { ...s.attributes } }]),
    );
  }

  onChange(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
  private emit() {
    this.listeners.forEach((l) => l());
  }

  setConnected(v: boolean) {
    this.connected = v;
    this.emit();
  }

  /** Dev helper: create or overwrite an entity (used by the scenario switcher). */
  setEntity(id: string, state: string, attributes: Record<string, unknown> = {}) {
    const cur = this.states[id];
    this.states = {
      ...this.states,
      [id]: {
        entity_id: id,
        state,
        attributes: { ...(cur?.attributes ?? {}), ...attributes },
        last_changed: new Date().toISOString(),
        last_updated: new Date().toISOString(),
      },
    };
    this.emit();
  }

  private mutate(id: string, fn: (s: HassEntity) => void) {
    const cur = this.states[id];
    if (!cur) return;
    const next: HassEntity = {
      ...cur,
      attributes: { ...cur.attributes },
      last_changed: new Date().toISOString(),
      last_updated: new Date().toISOString(),
    };
    fn(next);
    this.states = { ...this.states, [id]: next };
    this.emit();
  }

  private targetIds(data?: Record<string, unknown>): string[] {
    const eid = data?.entity_id;
    if (typeof eid === "string") return [eid];
    if (Array.isArray(eid)) return eid as string[];
    return [];
  }

  private callService = (domain: string, service: string, data?: Record<string, unknown>): Promise<unknown> => {
    const ids = this.targetIds(data);
    for (const id of ids) this.applyService(domain, service, data ?? {}, id);
    return Promise.resolve();
  };

  private applyService(domain: string, service: string, data: Record<string, unknown>, id: string) {
    const key = `${domain}.${service}`;
    const cur = this.states[id];
    if (!cur) return;
    const isOn = cur.state === "on" || cur.state === "playing" || cur.state === "open" || cur.state === "unlocked";
    switch (key) {
      case "light.turn_on":
      case "switch.turn_on":
      case "fan.turn_on":
      case "input_boolean.turn_on":
      case "homeassistant.turn_on":
        this.mutate(id, (s) => {
          s.state = "on";
          if (typeof data.brightness_pct === "number") s.attributes.brightness = Math.round((data.brightness_pct as number) * 2.55);
          if (typeof data.color_temp_kelvin === "number") {
            s.attributes.color_temp_kelvin = data.color_temp_kelvin;
            s.attributes.color_mode = "color_temp";
            s.attributes.rgb_color = undefined;
          }
          if (Array.isArray(data.rgb_color)) {
            s.attributes.rgb_color = data.rgb_color as number[];
            s.attributes.color_mode = "xy";
          }
          if (typeof data.effect === "string") s.attributes.effect = data.effect;
          if (typeof data.percentage === "number") s.attributes.percentage = data.percentage;
        });
        break;
      case "light.turn_off":
      case "switch.turn_off":
      case "fan.turn_off":
      case "input_boolean.turn_off":
      case "homeassistant.turn_off":
        this.mutate(id, (s) => {
          s.state = "off";
          s.attributes.brightness = null;
        });
        break;
      case "light.toggle":
      case "switch.toggle":
      case "fan.toggle":
      case "input_boolean.toggle":
      case "homeassistant.toggle":
        this.applyService(domain === "homeassistant" ? id.split(".")[0] : domain, isOn ? "turn_off" : "turn_on", data, id);
        break;
      case "fan.set_percentage":
        this.mutate(id, (s) => {
          s.attributes.percentage = data.percentage;
          s.state = (data.percentage as number) > 0 ? "on" : "off";
        });
        break;
      case "climate.set_temperature":
        this.mutate(id, (s) => (s.attributes.temperature = data.temperature));
        break;
      case "climate.set_hvac_mode":
        this.mutate(id, (s) => (s.state = String(data.hvac_mode)));
        break;
      case "climate.set_fan_mode":
        this.mutate(id, (s) => (s.attributes.fan_mode = data.fan_mode));
        break;
      case "climate.set_preset_mode":
        this.mutate(id, (s) => (s.attributes.preset_mode = data.preset_mode));
        break;
      case "climate.set_swing_mode":
        this.mutate(id, (s) => (s.attributes.swing_mode = data.swing_mode));
        break;
      case "cover.open_cover":
        this.mutate(id, (s) => {
          s.state = "open";
          s.attributes.current_position = 100;
        });
        break;
      case "cover.close_cover":
        this.mutate(id, (s) => {
          s.state = "closed";
          s.attributes.current_position = 0;
        });
        break;
      case "cover.set_cover_position":
        this.mutate(id, (s) => {
          s.attributes.current_position = data.position;
          s.state = (data.position as number) > 0 ? "open" : "closed";
        });
        break;
      case "media_player.media_play_pause":
        this.mutate(id, (s) => (s.state = s.state === "playing" ? "paused" : "playing"));
        break;
      case "media_player.volume_set":
        this.mutate(id, (s) => (s.attributes.volume_level = data.volume_level));
        break;
      case "media_player.volume_mute":
        this.mutate(id, (s) => (s.attributes.is_volume_muted = data.is_volume_muted));
        break;
      case "media_player.select_source":
        this.mutate(id, (s) => (s.attributes.source = data.source));
        break;
      case "lock.lock":
        this.mutate(id, (s) => (s.state = "locked"));
        break;
      case "lock.unlock":
        this.mutate(id, (s) => (s.state = "unlocked"));
        break;
      case "vacuum.start":
        this.mutate(id, (s) => (s.state = "cleaning"));
        break;
      case "vacuum.pause":
        this.mutate(id, (s) => (s.state = "paused"));
        break;
      case "vacuum.return_to_base":
        this.mutate(id, (s) => (s.state = "returning"));
        break;
      case "vacuum.set_fan_speed":
        this.mutate(id, (s) => (s.attributes.fan_speed = data.fan_speed));
        break;
      default:
        // scene/script/button/alarm etc. — no local state change needed.
        break;
    }
  }

  private callWS = async <T>(msg: Record<string, unknown>): Promise<T> => {
    if (msg.type === "history/history_during_period") {
      const id = (msg.entity_ids as string[])?.[0];
      return { [id]: this.syntheticHistory(id) } as unknown as T;
    }
    if (msg.type === "call_service" && msg.service === "get_forecasts") {
      const id = (msg.target as { entity_id: string })?.entity_id;
      return { response: { [id]: { forecast: this.syntheticForecast() } } } as unknown as T;
    }
    if (msg.type === "recorder/statistics_during_period") {
      return this.syntheticStatistics(msg) as unknown as T;
    }
    return {} as T;
  };

  private callApi = async <T>(): Promise<T> => {
    return [] as unknown as T;
  };

  private syntheticHistory(id: string) {
    const base = Number(this.states[id]?.state) || 100;
    const now = Date.now();
    const rows: Array<{ s: string; lu: number }> = [];
    for (let i = 48; i >= 0; i--) {
      const t = now - i * 30 * 60 * 1000;
      const wobble = Math.sin(i / 4) * base * 0.4 + (Math.random() - 0.5) * base * 0.2;
      rows.push({ s: String(Math.max(0, base + wobble).toFixed(1)), lu: Math.floor(t / 1000) });
    }
    return rows;
  }

  private syntheticForecast() {
    const conds = ["partlycloudy", "sunny", "rainy", "cloudy", "partlycloudy"];
    const now = new Date();
    return conds.map((c, i) => {
      const d = new Date(now.getTime() + (i + 1) * 86400000);
      return { datetime: d.toISOString(), condition: c, temperature: 18 + i, templow: 11 + i };
    });
  }

  private syntheticEnergy(id: string, t: number): number {
    // Deterministic per-bucket wobble so the dev chart is stable across renders.
    const wobble = 0.6 + 0.8 * Math.abs(Math.sin(t / 8.64e7));
    const day = new Date(t).getDay();
    if (id.includes("import")) return 5 + 3 * wobble;
    if (id.includes("export")) return 15 + 10 * wobble;
    if (id.includes("pv") || id.includes("solar")) return 20 + 14 * wobble;
    if (id.includes("wall_connector") || id.includes("car")) return day % 3 === 0 ? 10 * wobble : 0.4 * wobble;
    return 3 * wobble;
  }

  private syntheticStatistics(msg: Record<string, unknown>) {
    const ids = (msg.statistic_ids as string[]) ?? [];
    const period = (msg.period as string) ?? "day";
    const startMs = Date.parse(String(msg.start_time));
    const now = Date.now();
    const stepMs = period === "day" ? 864e5 : period === "week" ? 7 * 864e5 : 30 * 864e5;
    const scale = period === "day" ? 1 : period === "week" ? 7 : 30;
    const out: Record<string, Array<{ start: number; end: number; change: number; sum: number }>> = {};
    for (const id of ids) {
      const rows: Array<{ start: number; end: number; change: number; sum: number }> = [];
      let sum = 0;
      for (let t = startMs; t < now; t += stepMs) {
        const change = Number((this.syntheticEnergy(id, t) * scale).toFixed(2));
        sum = Number((sum + change).toFixed(2));
        rows.push({ start: t, end: t + stepMs, change, sum });
      }
      out[id] = rows;
    }
    return out;
  }

  /** Build a fresh immutable-ish `hass` snapshot for the panel. */
  build(): HomeAssistant {
    return {
      states: this.states,
      config: {
        latitude: 50.7,
        longitude: 4.3,
        unit_system: { length: "km", mass: "kg", temperature: "°C", volume: "L" },
        location_name: "Home",
        time_zone: "Europe/Brussels",
        version: "2026.8.2",
        currency: "EUR",
      },
      themes: { darkMode: this.darkMode },
      language: "en",
      locale: { language: "en" },
      connected: this.connected,
      connection: {
        connected: this.connected,
        subscribeEvents: async () => () => undefined,
        subscribeMessage: async () => () => undefined,
      },
      callService: this.callService,
      callWS: this.callWS,
      callApi: this.callApi,
    };
  }
}
