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

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly now: () => Date = () => new Date(),
  ) {
    this.selection = currentEnergyPeriodSelection(this.now());
    host.addController(this);
  }

  hostConnected(): void {
    this.scheduleMidnight();
  }

  hostDisconnected(): void {
    clearTimeout(this.midnightTimer);
  }

  showCurrent(period: EnergyPeriod = this.selection.period): void {
    this.followsCurrent = true;
    this.selection = { ...currentEnergyPeriodSelection(this.now()), period };
    this.host.requestUpdate();
  }

  select(selection: EnergyPeriodSelection): void {
    const range = resolveEnergyPeriod(selection, this.now());
    this.selection = range.selection;
    this.followsCurrent = range.isCurrent;
    this.host.requestUpdate();
  }

  shift(offset: number): void {
    this.select(shiftEnergyPeriod(this.selection, offset));
  }

  private scheduleMidnight(): void {
    clearTimeout(this.midnightTimer);
    const now = this.now();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const delay = Math.max(1, next.getTime() - now.getTime() + 50);
    this.midnightTimer = window.setTimeout(() => {
      if (this.followsCurrent) {
        this.selection = {
          ...currentEnergyPeriodSelection(this.now()),
          period: this.selection.period,
        };
        this.host.requestUpdate();
      }
      this.scheduleMidnight();
    }, delay);
  }
}
