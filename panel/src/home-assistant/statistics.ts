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

export interface StatisticMetadata {
  statistic_id: string;
  source: string;
  name: string | null;
  unit_class?: string | null;
  statistics_unit_of_measurement?: string | null;
  display_unit_of_measurement?: string | null;
  has_sum: boolean;
  has_mean: boolean;
}

export type StatisticsCoverage = "ready" | "partial" | "unavailable";

export interface EnergyStatisticsData {
  statistics: Record<string, StatBucket[]>;
  metadata: Record<string, StatisticMetadata>;
  coverage: StatisticsCoverage;
  coverageById: Record<string, StatisticsCoverage>;
}

export function emptyEnergyStatisticsData(): EnergyStatisticsData {
  return {
    statistics: {},
    metadata: {},
    coverage: "unavailable",
    coverageById: {},
  };
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
      if (!Number.isFinite(r.change as number)) return [];
      return [{ start, change: r.change as number }];
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
  units?: Record<string, string>,
): Promise<Record<string, StatBucket[]>> {
  const ids = statisticIds.filter(Boolean);
  if (!ids.length) return {};
  const raw = await hass.callWS<Record<string, RawBucket[]>>({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    ...(end ? { end_time: end.toISOString() } : {}),
    statistic_ids: ids,
    period,
    ...(units ? { units } : {}),
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

export async function fetchStatisticMetadata(
  hass: HomeAssistant,
  statisticIds: string[],
): Promise<StatisticMetadata[]> {
  const ids = [...new Set(statisticIds.filter(Boolean))];
  if (!ids.length) return [];
  return hass.callWS<StatisticMetadata[]>({
    type: "recorder/get_statistics_metadata",
    statistic_ids: ids,
  });
}

export function assessEnergyStatistics(
  statisticIds: string[],
  statistics: Record<string, StatBucket[]>,
  metadata: Record<string, StatisticMetadata>,
  expectedStarts: number[],
): EnergyStatisticsData {
  const coverageById: Record<string, StatisticsCoverage> = {};
  const clean: Record<string, StatBucket[]> = {};
  for (const id of statisticIds) {
    const source = statistics[id] ?? [];
    const rows = source.filter((bucket) => bucket.change >= 0);
    clean[id] = rows;
    const starts = new Set(rows.map((bucket) => bucket.start));
    const meta = metadata[id];
    const validMetadata = !!meta?.has_sum && (
      meta.unit_class === "energy" || ["Wh", "kWh", "MWh"].includes(meta.statistics_unit_of_measurement ?? "")
    );
    if (rows.length === 0) {
      coverageById[id] = "unavailable";
    } else if (
      rows.length !== source.length ||
      !validMetadata ||
      expectedStarts.some((start) => !starts.has(start))
    ) {
      coverageById[id] = "partial";
    } else {
      coverageById[id] = "ready";
    }
  }
  const states = Object.values(coverageById);
  const coverage = states.length > 0 && states.every((state) => state === "ready")
    ? "ready"
    : states.length === 0 || states.every((state) => state === "unavailable")
      ? "unavailable"
      : "partial";
  return { statistics: clean, metadata, coverage, coverageById };
}

export async function fetchEnergyStatistics(
  hass: HomeAssistant,
  statisticIds: string[],
  period: StatPeriod,
  start: Date,
  end: Date,
  expectedStarts: number[],
): Promise<EnergyStatisticsData> {
  const ids = [...new Set(statisticIds.filter(Boolean))];
  const [statistics, metadataList] = await Promise.all([
    fetchStatistics(hass, ids, period, start, end, { energy: "kWh" }),
    fetchStatisticMetadata(hass, ids).catch(() => []),
  ]);
  const metadata = Object.fromEntries(metadataList.map((item) => [item.statistic_id, item]));
  return assessEnergyStatistics(ids, statistics, metadata, expectedStarts);
}

/** Small LRU for immutable historical ranges; current ranges bypass it. */
export class StatisticsRangeCache {
  private readonly entries = new Map<string, EnergyStatisticsData>();

  constructor(private readonly maximum = 8) {}

  get(key: string): EnergyStatisticsData | undefined {
    const value = this.entries.get(key);
    if (!value) return undefined;
    this.entries.delete(key);
    this.entries.set(key, value);
    return value;
  }

  set(key: string, value: EnergyStatisticsData): void {
    this.entries.delete(key);
    this.entries.set(key, value);
    while (this.entries.size > this.maximum) {
      const oldest = this.entries.keys().next().value as string | undefined;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }

  get size(): number {
    return this.entries.size;
  }
}
