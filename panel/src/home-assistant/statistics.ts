import type { HomeAssistant } from "../types/hass.js";

/**
 * Long-range energy history via Home Assistant's Statistics API
 * (`recorder/statistics_during_period`). Unlike raw `history`, this returns the
 * recorder's aggregated buckets — the per-period `change` is exactly the energy
 * (kWh) that flowed in that hour / day / week / month for a
 * `total_increasing` sensor.
 */

export type StatPeriod = "hour" | "day" | "week" | "month";

/** One aggregated bucket: the period start (epoch ms) and its energy delta. */
export interface StatBucket {
  start: number;
  change: number;
}

interface RawBucket {
  start: number | string;
  change?: number | null;
}

/** Normalize the raw WS response into finite-`change` buckets keyed by id. */
export function normalizeStatistics(
  raw: Record<string, RawBucket[]> | undefined,
): Record<string, StatBucket[]> {
  const out: Record<string, StatBucket[]> = {};
  for (const [id, rows] of Object.entries(raw ?? {})) {
    out[id] = (rows ?? []).flatMap((r) => {
      const start = typeof r.start === "number" ? r.start : Date.parse(String(r.start));
      if (!Number.isFinite(start)) return [];
      return [{
        start,
        change: Number.isFinite(r.change as number) ? (r.change as number) : 0,
      }];
    });
  }
  return out;
}

/**
 * A period-aligned start time `buckets` periods back from `now`. The API returns
 * buckets from here to the present; callers take the trailing `buckets` of them.
 */
export function statisticsRange(period: StatPeriod, buckets: number, now = new Date()): Date {
  const start = new Date(now);
  if (period === "hour") {
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() - (buckets - 1));
  } else {
    start.setHours(0, 0, 0, 0);
  }
  if (period === "day") {
    start.setDate(start.getDate() - (buckets - 1));
  } else if (period === "week") {
    const mondayOffset = (start.getDay() + 6) % 7; // ISO week starts Monday
    start.setDate(start.getDate() - mondayOffset - 7 * (buckets - 1));
  } else if (period === "month") {
    start.setDate(1);
    start.setMonth(start.getMonth() - (buckets - 1));
  }
  return start;
}

/** Short x-axis label for a bucket start, appropriate to the period. */
export function bucketLabel(startMs: number, period: StatPeriod): string {
  const d = new Date(startMs);
  if (Number.isNaN(d.getTime())) return "";
  if (period === "hour") return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  if (period === "day") return d.toLocaleDateString(undefined, { weekday: "short" });
  if (period === "week") return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  return d.toLocaleDateString(undefined, { month: "short" });
}

/**
 * Fetch aggregated statistics for the given ids over [start, end). Thin wrapper
 * over `callWS`; the parsing is delegated to `normalizeStatistics` (tested).
 */
export async function fetchStatistics(
  hass: HomeAssistant,
  statisticIds: string[],
  period: StatPeriod,
  start: Date,
  end?: Date,
): Promise<Record<string, StatBucket[]>> {
  const ids = statisticIds.filter(Boolean);
  if (!ids.length) return {};
  const raw = await hass.callWS<Record<string, RawBucket[]>>({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    ...(end ? { end_time: end.toISOString() } : {}),
    statistic_ids: ids,
    period,
    types: ["change"],
  });
  const normalized = normalizeStatistics(raw);
  const from = start.getTime();
  const to = end?.getTime();
  return Object.fromEntries(Object.entries(normalized).map(([id, buckets]) => [
    id,
    buckets.filter((bucket) => bucket.start >= from && (to === undefined || bucket.start < to)),
  ]));
}
