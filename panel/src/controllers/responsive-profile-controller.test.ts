import { afterEach, describe, expect, it, vi } from "vitest";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { ResponsiveProfileController } from "./responsive-profile-controller.js";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ResponsiveProfileController", () => {
  it("defers width changes and resolves the corresponding profile", () => {
    let observerCallback: ResizeObserverCallback | undefined;
    let frameCallback: FrameRequestCallback | undefined;
    let registeredController: ReactiveController | undefined;
    const requestUpdate = vi.fn();
    const host = {
      addController(controller: ReactiveController) {
        registeredController = controller;
      },
      getBoundingClientRect: () => ({ width: 320 }),
      requestUpdate,
    } as unknown as ReactiveControllerHost & HTMLElement;

    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          observerCallback = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frameCallback = callback;
      return 1;
    });

    const controller = new ResponsiveProfileController(host, (width) => width < 600 ? "compact" : "expanded");
    expect(registeredController).toBe(controller);
    controller.hostConnected();
    expect(controller.profile).toBe("compact");
    observerCallback?.([{ contentRect: { width: 768 } } as ResizeObserverEntry], {} as ResizeObserver);

    expect(controller.width).toBe(320);
    expect(requestUpdate).not.toHaveBeenCalled();
    frameCallback?.(0);
    expect(controller.width).toBe(768);
    expect(controller.profile).toBe("expanded");
    expect(requestUpdate).toHaveBeenCalledOnce();
  });
});
