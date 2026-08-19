import type { HassEntity, HomeAssistant } from "../types/hass.js";
import { isUnavailable, isUnknown } from "./capabilities.js";

/**
 * Locale-aware display formatting. We prefer Home Assistant's own formatters
 * (`hass.formatEntityState`, `hass.formatEntityAttributeValue`) so numbers,
 * units, dates and translated states follow the user's locale exactly. Each
 * has a self-contained fallback for older cores or the dev harness.
 */

export function friendlyName(stateObj: HassEntity | undefined, fallback: string): string {
  return stateObj?.attributes.friendly_name?.trim() || fallback;
}

/** Human, localized state string ("On", "Heating", "22.5 °C", …). */
export function formatState(hass: HomeAssistant | undefined, stateObj: HassEntity | undefined): string {
  if (!stateObj) return "—";
  if (isUnavailable(stateObj)) return "Unavailable";
  if (isUnknown(stateObj)) return "Unknown";
  if (hass?.formatEntityState) {
    try {
      return hass.formatEntityState(stateObj);
    } catch {
      /* fall through to local formatting */
    }
  }
  return localFormatState(stateObj);
}

export function formatAttribute(
  hass: HomeAssistant | undefined,
  stateObj: HassEntity | undefined,
  attribute: string,
): string {
  if (!stateObj) return "—";
  if (hass?.formatEntityAttributeValue) {
    try {
      return hass.formatEntityAttributeValue(stateObj, attribute);
    } catch {
      /* fall through */
    }
  }
  const v = stateObj.attributes[attribute];
  return v == null ? "—" : String(v);
}

function localFormatState(stateObj: HassEntity): string {
  const unit = stateObj.attributes.unit_of_measurement;
  const num = Number(stateObj.state);
  if (!Number.isNaN(num) && stateObj.state.trim() !== "") {
    return unit ? `${formatNumber(num)} ${unit}` : formatNumber(num);
  }
  return titleCase(stateObj.state);
}

export function formatNumber(value: number, maxFractionDigits = 1): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : maxFractionDigits;
  try {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: digits,
      minimumFractionDigits: 0,
    }).format(value);
  } catch {
    return value.toFixed(digits);
  }
}

export function titleCase(s: string): string {
  return s
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/** "3 min ago", "2 h ago", "just now" — relative time from an ISO string. */
export function relativeTime(iso: string | undefined): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const deltaSec = Math.round((Date.now() - then) / 1000);
  const abs = Math.abs(deltaSec);
  const rtf = safeRtf();
  const pick = (): [number, Intl.RelativeTimeFormatUnit] => {
    if (abs < 60) return [-deltaSec, "second"];
    if (abs < 3600) return [-Math.round(deltaSec / 60), "minute"];
    if (abs < 86400) return [-Math.round(deltaSec / 3600), "hour"];
    return [-Math.round(deltaSec / 86400), "day"];
  };
  const [value, unit] = pick();
  if (abs < 45) return "just now";
  if (rtf) return rtf.format(value, unit);
  return `${Math.abs(value)} ${unit}${Math.abs(value) === 1 ? "" : "s"} ${value < 0 ? "ago" : "from now"}`;
}

let _rtf: Intl.RelativeTimeFormat | null | undefined;
function safeRtf(): Intl.RelativeTimeFormat | null {
  if (_rtf !== undefined) return _rtf;
  try {
    _rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  } catch {
    _rtf = null;
  }
  return _rtf;
}

/** Time-of-day like "20:14", locale-aware. */
export function formatTime(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(d);
  } catch {
    return d.toTimeString().slice(0, 5);
  }
}

/** mm:ss / h:mm:ss for media durations (seconds). */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const s = Math.floor(totalSeconds % 60);
  const m = Math.floor((totalSeconds / 60) % 60);
  const h = Math.floor(totalSeconds / 3600);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
