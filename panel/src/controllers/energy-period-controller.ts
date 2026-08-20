import type { ReactiveController, ReactiveControllerHost } from "lit";
import {
  currentEnergyPeriodSelection,
  resolveEnergyPeriod,
  shiftEnergyPeriod,
  type EnergyPeriod,
  type EnergyPeriodSelection,
} from "../energy/energy-period.js";

/** Owns the Energy page's selection and keeps its default current across midnight. */
export class EnergyPeriodController implements ReactiveController {
  selection: EnergyPeriodSelection;
  private followsCurrent = true;
  private midnightTimer = 0;
  private timeZone?: string;
  private connected = false;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.selection = currentEnergyPeriodSelection(this.now(), this.timeZone);
    host.addController(this);
  }

  hostConnected(): void {
    this.connected = true;
    this.scheduleMidnight();
  }

  hostDisconnected(): void {
    this.connected = false;
    clearTimeout(this.midnightTimer);
  }

  showCurrent(period: EnergyPeriod = this.selection.period): void {
    this.followsCurrent = true;
    this.selection = { ...currentEnergyPeriodSelection(this.now(), this.timeZone), period };
    this.host.requestUpdate();
  }

  select(selection: EnergyPeriodSelection): void {
    const range = resolveEnergyPeriod(selection, this.now(), this.timeZone);
    this.selection = range.selection;
    this.followsCurrent = range.isCurrent;
    this.host.requestUpdate();
  }

  shift(offset: number): void {
    this.select(shiftEnergyPeriod(this.selection, offset, this.now(), this.timeZone));
  }

  setTimeZone(timeZone: string | undefined, requestUpdate = true): void {
    if (timeZone === this.timeZone) return;
    this.timeZone = timeZone;
    if (this.followsCurrent) {
      this.selection = {
        ...currentEnergyPeriodSelection(this.now(), this.timeZone),
        period: this.selection.period,
      };
    }
    if (this.connected) this.scheduleMidnight();
    if (requestUpdate) this.host.requestUpdate();
  }

  private scheduleMidnight(): void {
    clearTimeout(this.midnightTimer);
    const now = this.now();
    const today = currentEnergyPeriodSelection(now, this.timeZone);
    const next = resolveEnergyPeriod(today, now, this.timeZone).end;
    const delay = Math.max(1, next.getTime() - now.getTime() + 50);
    this.midnightTimer = window.setTimeout(() => {
      if (this.followsCurrent) {
        this.selection = {
          ...currentEnergyPeriodSelection(this.now(), this.timeZone),
          period: this.selection.period,
        };
        this.host.requestUpdate();
      }
      this.scheduleMidnight();
    }, delay);
  }
}
