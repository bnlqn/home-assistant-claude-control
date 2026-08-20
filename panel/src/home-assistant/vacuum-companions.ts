import type { HomeAssistant } from "../types/hass.js";
import { isUnavailable, isUnknown } from "./capabilities.js";

/**
 * Roborock (and most modern robot vacuums) split the interesting telemetry —
 * battery, live status, current room, cleaning progress, consumable wear — into
 * sibling `sensor.*` entities rather than exposing them as attributes on the
 * `vacuum.*` entity itself. This resolves those companions from the vacuum's
 * object id (e.g. `vacuum.roborock_s8_pro_ultra` → `sensor.roborock_s8_pro_ultra_battery`)
 * so the widget and detail can surface them.
 *
 * Every field is optional and only populated when the companion exists and holds
 * a usable value — a vacuum without these sensors degrades to the bare controls.
 */
export interface VacuumConsumable {
  key: string;
  label: string;
  hoursLeft: number;
}

export interface VacuumCompanions {
  battery?: number; // %
  status?: string; // raw status string, e.g. "charging" | "cleaning" | "drying"
  room?: string; // current room name, omitted when unknown
  progress?: number; // cleaning progress %
  area?: number; // m² cleaned this run
  cleaningTime?: number; // minutes elapsed this run
  consumables: VacuumConsumable[];
  /** Companion entity ids that currently exist — for re-render gating. */
  ids: string[];
}

const CONSUMABLES: ReadonlyArray<readonly [suffix: string, label: string]> = [
  ["main_brush_time_left", "Main brush"],
  ["side_brush_time_left", "Side brush"],
  ["filter_time_left", "Filter"],
  ["sensor_time_left", "Sensors"],
  ["dock_maintenance_brush_time_left", "Dock brush"],
  ["dock_strainer_time_left", "Dock strainer"],
];

/** Hours-left threshold below which a consumable is flagged for replacement. */
export const CONSUMABLE_LOW_HOURS = 20;

function readNumber(hass: HomeAssistant | undefined, id: string, out: string[]): number | undefined {
  const s = hass?.states[id];
  if (!s) return undefined;
  out.push(id);
  if (isUnavailable(s) || isUnknown(s)) return undefined;
  const n = Number(s.state);
  return Number.isFinite(n) ? n : undefined;
}

function readString(hass: HomeAssistant | undefined, id: string, out: string[]): string | undefined {
  const s = hass?.states[id];
  if (!s) return undefined;
  out.push(id);
  if (isUnavailable(s) || isUnknown(s)) return undefined;
  return s.state || undefined;
}

export function vacuumCompanions(hass: HomeAssistant | undefined, vacuumId: string | undefined): VacuumCompanions {
  const ids: string[] = [];
  const empty: VacuumCompanions = { consumables: [], ids };
  if (!hass || !vacuumId) return empty;
  const objectId = vacuumId.split(".")[1];
  if (!objectId) return empty;
  const prefix = `sensor.${objectId}_`;

  const consumables: VacuumConsumable[] = [];
  for (const [suffix, label] of CONSUMABLES) {
    const hoursLeft = readNumber(hass, prefix + suffix, ids);
    if (hoursLeft != null) consumables.push({ key: suffix, label, hoursLeft });
  }

  return {
    battery: readNumber(hass, prefix + "battery", ids),
    status: readString(hass, prefix + "status", ids),
    room: readString(hass, prefix + "current_room", ids),
    progress: readNumber(hass, prefix + "cleaning_progress", ids),
    area: readNumber(hass, prefix + "cleaning_area", ids),
    cleaningTime: readNumber(hass, prefix + "cleaning_time", ids),
    consumables,
    ids,
  };
}
