import type { AsyncStatus } from "../controllers/keyed-async-controller.js";
import type { ViewConfig } from "../config/schema.js";
import type { StatBucket, StatPeriod } from "../home-assistant/statistics.js";

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
}

/** Shared by the Energy hero and every historical widget on its page. */
export interface EnergyPeriodContext {
  range: EnergyPeriodRange;
  statistics: Record<string, StatBucket[]>;
  status: AsyncStatus;
  error?: unknown;
}

export function currentEnergyPeriodSelection(now = new Date()): EnergyPeriodSelection {
  return { period: "day", anchor: calendarDate(now) };
}

export function resolveEnergyPeriod(
  selection: EnergyPeriodSelection,
  now = new Date(),
): EnergyPeriodRange {
  const anchor = parseCalendarDate(selection.anchor) ?? localNoon(now);
  const start = localMidnight(anchor);

  if (selection.period === "week") {
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
  } else if (selection.period === "month") {
    start.setDate(1);
  }

  const end = new Date(start);
  if (selection.period === "day") end.setDate(end.getDate() + 1);
  if (selection.period === "week") end.setDate(end.getDate() + 7);
  if (selection.period === "month") end.setMonth(end.getMonth() + 1);

  const normalized = { period: selection.period, anchor: calendarDate(anchor) };
  return {
    selection: normalized,
    start,
    end,
    statisticPeriod: selection.period === "day" ? "hour" : "day",
    key: `${selection.period}:${start.toISOString()}:${end.toISOString()}`,
    label: periodLabel(selection.period, start, end, now),
    isCurrent: now.getTime() >= start.getTime() && now.getTime() < end.getTime(),
  };
}

/** Immutable navigation primitive for the future Energy date controls. */
export function shiftEnergyPeriod(
  selection: EnergyPeriodSelection,
  offset: number,
): EnergyPeriodSelection {
  const anchor = parseCalendarDate(selection.anchor) ?? localNoon(new Date());
  if (selection.period === "day") anchor.setDate(anchor.getDate() + offset);
  if (selection.period === "week") anchor.setDate(anchor.getDate() + offset * 7);
  if (selection.period === "month") {
    anchor.setDate(1);
    anchor.setMonth(anchor.getMonth() + offset);
  }
  return { period: selection.period, anchor: calendarDate(anchor) };
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

function periodLabel(period: EnergyPeriod, start: Date, end: Date, now: Date): string {
  const currentDay = localMidnight(now).getTime();
  if (period === "day") {
    if (start.getTime() === currentDay) return "Today";
    const yesterday = localMidnight(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (start.getTime() === yesterday.getTime()) return "Yesterday";
    return start.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }
  if (period === "month") {
    return start.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }
  const inclusiveEnd = new Date(end);
  inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
  const startLabel = start.toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const endLabel = inclusiveEnd.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${startLabel} – ${endLabel}`;
}

function calendarDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseCalendarDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day, 12, 0, 0, 0);
  return calendarDate(parsed) === value ? parsed : null;
}

function localNoon(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 12, 0, 0, 0);
}

function localMidnight(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
}
