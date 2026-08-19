import type { HassEntity } from "../types/hass.js";

/**
 * Pure energy-flow math for the power-flow widget. Kept free of rendering and
 * of Home Assistant plumbing so it can be exhaustively unit-tested.
 *
 * Sign conventions (verified against this home's live entities):
 *  - grid power (HomeWizard P1 `active_power_w`): POSITIVE = importing from the
 *    grid, NEGATIVE = exporting to the grid.
 *  - solar / car power: non-negative magnitudes.
 * All powers are normalized to WATTS before the math runs.
 */

/** Below this magnitude (W) a flow reads as idle — smooths the P1 "0 = import" quirk. */
export const FLOW_DEADBAND_W = 25;

/** Convert an entity's state to watts, honoring its unit (kW → W). null if unusable. */
export function toWatts(stateObj: HassEntity | undefined): number | null {
  if (!stateObj) return null;
  const raw = Number(stateObj.state);
  if (!Number.isFinite(raw)) return null; // unavailable / unknown / non-numeric
  const unit = String(stateObj.attributes.unit_of_measurement ?? "").toLowerCase();
  if (unit === "kw") return raw * 1000;
  if (unit === "mw") return raw * 1_000_000;
  return raw; // assume W
}

export type FlowDirection = "toHouse" | "toGrid" | "toCar" | "idle";
export type FlowSource = "grid" | "solar" | "mixed";

export interface FlowPath {
  watts: number;
  direction: FlowDirection;
  active: boolean;
  source: FlowSource;
}

export interface FlowNode {
  /** Magnitude in watts (always ≥ 0). */
  watts: number;
  active: boolean;
}

export interface FlowModel {
  grid: FlowNode & { mode: "import" | "export" | "idle" };
  solar: FlowNode;
  house: FlowNode;
  car: FlowNode & { connected: boolean };
  paths: {
    gridHouse: FlowPath;
    solarHouse: FlowPath;
    houseCar: FlowPath;
  };
  /** Share of total consumption (house + car) currently supplied by solar, 0..100. */
  selfSufficiency: number;
}

export interface FlowInput {
  /** Signed grid power in W (+import / −export). null when unavailable. */
  grid: number | null;
  /** Solar production in W. null when unavailable. */
  solar: number | null;
  /** Car charge power in W. null when unavailable. */
  car: number | null;
  /** Whether the car is connected/charging (drives whether car power counts). */
  carActive: boolean;
  /** Whether the car is at least plugged in (for the "dim but present" node). */
  carConnected?: boolean;
}

function clampMin0(n: number): number {
  return n > 0 ? n : 0;
}

/**
 * Build the flow model from normalized readings. House load is derived as
 * `solar + grid − car` (grid signed), which matches this home's measured house
 * sensor and guarantees the arrows balance.
 */
export function computeFlows(input: FlowInput): FlowModel {
  const grid = input.grid ?? 0;
  const solar = clampMin0(input.solar ?? 0);
  const carRaw = clampMin0(input.car ?? 0);
  const carW = input.carActive ? carRaw : 0;

  const importW = clampMin0(grid);
  const exportW = clampMin0(-grid);
  const house = clampMin0(solar + grid - carW);

  const gridActive = importW > FLOW_DEADBAND_W || exportW > FLOW_DEADBAND_W;
  const solarActive = solar > FLOW_DEADBAND_W;
  const carFlowing = input.carActive && carW > FLOW_DEADBAND_W;

  const gridMode: "import" | "export" | "idle" =
    importW > FLOW_DEADBAND_W ? "import" : exportW > FLOW_DEADBAND_W ? "export" : "idle";

  const gridHouse: FlowPath = {
    watts: gridMode === "export" ? exportW : importW,
    direction: gridMode === "import" ? "toHouse" : gridMode === "export" ? "toGrid" : "idle",
    active: gridActive,
    // Exported energy is solar in origin; imported is grid.
    source: gridMode === "export" ? "solar" : "grid",
  };

  const solarHouse: FlowPath = {
    watts: solar,
    direction: solarActive ? "toHouse" : "idle",
    active: solarActive,
    source: "solar",
  };

  const houseCar: FlowPath = {
    watts: carW,
    direction: carFlowing ? "toCar" : "idle",
    active: carFlowing,
    // If we're exporting, there's surplus solar covering the car; else it's grid.
    source: !carFlowing ? "grid" : exportW > FLOW_DEADBAND_W ? "solar" : solar > carW ? "solar" : "grid",
  };

  const load = house + carW;
  const selfSufficiency = load > 0 ? Math.round((Math.min(solar, load) / load) * 100) : solar > 0 ? 100 : 0;

  return {
    grid: { watts: Math.abs(grid), active: gridActive, mode: gridMode },
    solar: { watts: solar, active: solarActive },
    house: { watts: house, active: house > FLOW_DEADBAND_W },
    car: { watts: carW, active: carFlowing, connected: input.carConnected ?? input.carActive },
    paths: { gridHouse, solarHouse, houseCar },
    selfSufficiency,
  };
}

/** Interpret a Tesla/wall-connector status/charging enum as "actively charging". */
export function isCarActive(statusState: string | undefined): boolean {
  if (!statusState) return false;
  const s = statusState.toLowerCase();
  return s === "charging" || s === "starting";
}

/** Interpret a charger status enum as "at least plugged in". */
export function isCarConnected(statusState: string | undefined): boolean {
  if (!statusState) return false;
  const s = statusState.toLowerCase();
  return s !== "not_connected" && s !== "disconnected" && s !== "unavailable" && s !== "unknown";
}
