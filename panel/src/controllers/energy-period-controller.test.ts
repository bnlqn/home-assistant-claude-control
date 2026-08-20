import { describe, expect, it, vi } from "vitest";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { EnergyPeriodController } from "./energy-period-controller.js";

describe("EnergyPeriodController", () => {
  it("supports current, rewind, and period changes through one selection", () => {
    let registered: ReactiveController | undefined;
    const host = {
      addController(controller: ReactiveController) {
        registered = controller;
      },
      requestUpdate: vi.fn(),
    } as unknown as ReactiveControllerHost;
    const now = () => new Date(2026, 7, 21, 14, 30);
    const controller = new EnergyPeriodController(host, now);

    expect(registered).toBe(controller);
    expect(controller.selection).toEqual({ period: "day", anchor: "2026-08-21" });
    controller.shift(-1);
    expect(controller.selection).toEqual({ period: "day", anchor: "2026-08-20" });
    controller.showCurrent("week");
    expect(controller.selection).toEqual({ period: "week", anchor: "2026-08-21" });
  });

  it("advances the default current selection across midnight", () => {
    vi.useFakeTimers();
    try {
      let clock = new Date(2026, 7, 21, 23, 59, 59, 900);
      let registered: ReactiveController | undefined;
      const host = {
        addController(controller: ReactiveController) {
          registered = controller;
        },
        requestUpdate: vi.fn(),
      } as unknown as ReactiveControllerHost;
      const controller = new EnergyPeriodController(host, () => clock);
      registered!.hostConnected?.();
      clock = new Date(2026, 7, 22, 0, 0, 0, 100);

      vi.advanceTimersByTime(200);

      expect(controller.selection.anchor).toBe("2026-08-22");
      expect(host.requestUpdate).toHaveBeenCalledOnce();
      registered!.hostDisconnected?.();
    } finally {
      vi.useRealTimers();
    }
  });

  it("reanchors a followed selection when the HA timezone arrives", () => {
    const host = {
      addController() {},
      requestUpdate: vi.fn(),
    } as unknown as ReactiveControllerHost;
    const controller = new EnergyPeriodController(
      host,
      () => new Date("2026-08-21T22:30:00.000Z"),
    );

    controller.setTimeZone("Europe/Brussels", false);

    expect(controller.selection.anchor).toBe("2026-08-22");
  });
});
