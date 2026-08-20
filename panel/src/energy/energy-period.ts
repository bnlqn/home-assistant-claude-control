import type { AsyncStatus } from "../controllers/keyed-async-controller.js";
import type { ViewConfig } from "../config/schema.js";
import type {
  StatisticMetadata,
  StatisticsCoverage,
  StatBucket,
  StatPeriod,
} from "../home-assistant/statistics.js";

export type EnergyPeriod = "day" | "week" | "month";

/** Serializable page-level selection. The anchor is a local calendar date. */
export interface EnergyPeriodSelection {
  period: EnergyPeriod;
  anchor: string;
}

export interface EnergyPeriodRange {
  selection: EnergyPeriodSelection;
  start: Date;
  end: Date;
  statisticPeriod: StatPeriod;
  key: string;
  label: string;
  isCurrent: boolean;
  timeZone?: string;
}

/** Shared by the Energy hero and every historical widget on its page. */
export interface EnergyPeriodContext {
  range: EnergyPeriodRange;
  statistics: Record<string, StatBucket[]>;
  metadata: Record<string, StatisticMetadata>;
  coverage: StatisticsCoverage;
  coverageById: Record<string, StatisticsCoverage>;
  status: AsyncStatus;
  error?: unknown;
}

/** Human-readable integrity state for recorder-backed Energy totals. */
export function energyStatisticsAvailability(
  context: EnergyPeriodContext | undefined,
): string | null {
  if (!context) return null;
  if (context.status === "loading" || context.status === "idle") return "Loading";
  if (context.status === "error" || context.coverage === "unavailable") return "Unavailable";
  return context.coverage === "partial" ? "Partial" : null;
}

export function currentEnergyPeriodSelection(
  now = new Date(),
  timeZone?: string,
): EnergyPeriodSelection {
  return { period: "day", anchor: calendarDate(now, normalizeTimeZone(timeZone)) };
}

export function resolveEnergyPeriod(
  selection: EnergyPeriodSelection,
  now = new Date(),
  timeZone?: string,
): EnergyPeriodRange {
  const zone = normalizeTimeZone(timeZone);
  const anchor = parseCalendarDate(selection.anchor) ?? parseCalendarDate(calendarDate(now, zone))!;
  let startParts = anchor;

  if (selection.period === "week") {
    const mondayOffset = (dayOfWeek(startParts) + 6) % 7;
    startParts = addCalendarDays(startParts, -mondayOffset);
  } else if (selection.period === "month") {
    startParts = { ...startParts, day: 1 };
  }

  const endParts = selection.period === "day"
    ? addCalendarDays(startParts, 1)
    : selection.period === "week"
      ? addCalendarDays(startParts, 7)
      : addCalendarMonths(startParts, 1);
  const start = calendarMidnight(startParts, zone);
  const end = calendarMidnight(endParts, zone);

  const normalized = { period: selection.period, anchor: formatCalendarParts(anchor) };
  return {
    selection: normalized,
    start,
    end,
    statisticPeriod: selection.period === "day" ? "hour" : "day",
    key: `${selection.period}:${zone ?? "local"}:${start.toISOString()}:${end.toISOString()}`,
    label: periodLabel(selection.period, start, end, now, zone),
    isCurrent: now.getTime() >= start.getTime() && now.getTime() < end.getTime(),
    ...(zone ? { timeZone: zone } : {}),
  };
}

/** Immutable navigation primitive for the future Energy date controls. */
export function shiftEnergyPeriod(
  selection: EnergyPeriodSelection,
  offset: number,
  now = new Date(),
  timeZone?: string,
): EnergyPeriodSelection {
  const zone = normalizeTimeZone(timeZone);
  const anchor = parseCalendarDate(selection.anchor) ?? parseCalendarDate(calendarDate(now, zone))!;
  const shifted = selection.period === "day"
    ? addCalendarDays(anchor, offset)
    : selection.period === "week"
      ? addCalendarDays(anchor, offset * 7)
      : addCalendarMonths({ ...anchor, day: 1 }, offset);
  return { period: selection.period, anchor: formatCalendarParts(shifted) };
}

export function sumStatistic(
  statistics: Record<string, StatBucket[]>,
  statisticId: string | undefined,
): number | null {
  if (!statisticId) return null;
  const buckets = statistics[statisticId];
  if (!buckets?.length) return null;
  return buckets.reduce((sum, bucket) => sum + bucket.change, 0);
}

/** Bucket starts expected up to `now`, respecting DST and incomplete current periods. */
export function energyExpectedBucketStarts(
  range: EnergyPeriodRange,
  now = new Date(),
): number[] {
  const cutoff = Math.min(range.end.getTime(), now.getTime());
  if (cutoff <= range.start.getTime()) return [];
  const starts: number[] = [];
  if (range.statisticPeriod === "hour") {
    for (let start = range.start.getTime(); start < cutoff; start += 60 * 60 * 1000) {
      starts.push(start);
    }
    return starts;
  }
  let parts = parseCalendarDate(calendarDate(range.start, range.timeZone))!;
  let start = range.start;
  while (start.getTime() < cutoff) {
    starts.push(start.getTime());
    parts = addCalendarDays(parts, 1);
    start = calendarMidnight(parts, range.timeZone);
  }
  return starts;
}

/** Recorder ids required by all historical consumers on one Energy page. */
export function energyStatisticIds(view: ViewConfig | undefined): string[] {
  if (view?.hero?.type !== "energy") return [];
  const ids = new Set<string>();
  for (const id of Object.values(view.hero.statistics ?? {})) {
    if (id) ids.add(id);
  }
  for (const widget of view.widgets) {
    if (widget.type === "electricitytotal") {
      if (widget.options?.importEnergy) ids.add(widget.options.importEnergy);
      if (widget.options?.exportEnergy) ids.add(widget.options.exportEnergy);
    }
    if (widget.type === "energychart") {
      const options = widget.options;
      for (const id of [options?.gridImport, options?.gridExport, options?.solar, options?.car]) {
        if (id) ids.add(id);
      }
    }
  }
  return [...ids].sort();
}

interface CalendarParts {
  year: number;
  month: number;
  day: number;
}

function periodLabel(
  period: EnergyPeriod,
  start: Date,
  end: Date,
  now: Date,
  timeZone?: string,
): string {
  if (period === "day") {
    const today = currentEnergyPeriodSelection(now, timeZone);
    if (calendarDate(start, timeZone) === today.anchor) return "Today";
    if (calendarDate(start, timeZone) === shiftEnergyPeriod(today, -1, now, timeZone).anchor) {
      return "Yesterday";
    }
    return start.toLocaleDateString(undefined, {
      day: "numeric", month: "short", year: "numeric", timeZone,
    });
  }
  if (period === "month") {
    return start.toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone });
  }
  const inclusiveEnd = new Date(end.getTime() - 1);
  const startLabel = start.toLocaleDateString(undefined, { day: "numeric", month: "short", timeZone });
  const endLabel = inclusiveEnd.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone,
  });
  return `${startLabel} – ${endLabel}`;
}

function calendarDate(value: Date, timeZone?: string): string {
  if (!timeZone) {
    return formatCalendarParts({
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
    });
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return formatCalendarParts({ year: valueOf("year"), month: valueOf("month"), day: valueOf("day") });
}

function parseCalendarDate(value: string): CalendarParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month || check.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day };
}

function formatCalendarParts(parts: CalendarParts): string {
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function addCalendarDays(parts: CalendarParts, days: number): CalendarParts {
  const value = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days));
  return { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: value.getUTCDate() };
}

function addCalendarMonths(parts: CalendarParts, months: number): CalendarParts {
  const value = new Date(Date.UTC(parts.year, parts.month - 1 + months, 1));
  return { year: value.getUTCFullYear(), month: value.getUTCMonth() + 1, day: 1 };
}

function dayOfWeek(parts: CalendarParts): number {
  return new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
}

function calendarMidnight(parts: CalendarParts, timeZone?: string): Date {
  if (!timeZone) return new Date(parts.year, parts.month - 1, parts.day);
  const targetWallTime = Date.UTC(parts.year, parts.month - 1, parts.day);
  let instant = targetWallTime;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const formatted = formatter.formatToParts(new Date(instant));
    const valueOf = (type: Intl.DateTimeFormatPartTypes) =>
      Number(formatted.find((part) => part.type === type)?.value);
    const wallTime = Date.UTC(
      valueOf("year"), valueOf("month") - 1, valueOf("day"),
      valueOf("hour"), valueOf("minute"), valueOf("second"),
    );
    const adjustment = targetWallTime - wallTime;
    instant += adjustment;
    if (adjustment === 0) break;
  }
  return new Date(instant);
}

function normalizeTimeZone(timeZone: string | undefined): string | undefined {
  if (!timeZone) return undefined;
  try {
    new Intl.DateTimeFormat("en", { timeZone }).format(0);
    return timeZone;
  } catch {
    return undefined;
  }
}
