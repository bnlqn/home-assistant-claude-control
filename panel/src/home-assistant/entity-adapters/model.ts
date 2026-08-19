import type { HassEntity } from "../../types/hass.js";
import type { ServiceCall } from "../service-calls.js";

/** Which color family the widget's icon container / accents should use. */
export type AccentToken =
  | "idle"
  | "unavailable"
  | "accent"
  | "light"
  | "heat"
  | "cool"
  | "eco"
  | "warn"
  | "alert";

export interface QuickAction {
  /** toggle = flip on/off · activate = fire-and-forget (scene/script) · none = no direct action (body opens detail). */
  kind: "toggle" | "activate" | "none";
  label: string;
  call?: ServiceCall;
  requiresConfirmation?: boolean;
}

/**
 * Normalized, presentation-ready view of a Home Assistant entity. Visual
 * components read only this — they never parse raw domain quirks themselves.
 */
export interface EntityViewModel {
  entityId: string;
  domain: string;
  stateObj?: HassEntity;

  exists: boolean; // present in hass.states
  available: boolean; // present and not "unavailable"
  unknown: boolean; // state === "unknown"
  isPlaceholder: boolean; // entity id still contains REPLACE_ME

  name: string;
  icon: string; // resolved mdi:* glyph
  rawState: string;
  displayState: string; // localized
  secondary?: string;

  active: boolean; // "engaged" — on / playing / heating / cleaning …
  accent: AccentToken;

  /** Optional CSS color string when an entity has a real color (light RGB). */
  rgbCss?: string;

  /** 0..100 convenience for lights / covers / fans. */
  level?: number;

  quickAction: QuickAction;
}
