import { describe, expect, it, vi } from "vitest";
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { KeyedAsyncController } from "./keyed-async-controller.js";

function deferred<Value>() {
  let resolve!: (value: Value) => void;
  const promise = new Promise<Value>((done) => (resolve = done));
  return { promise, resolve };
}

describe("KeyedAsyncController", () => {
  it("deduplicates keys and ignores stale or disconnected results", async () => {
    let registeredController: ReactiveController | undefined;
    const requestUpdate = vi.fn();
    const host = {
      addController(controller: ReactiveController) {
        registeredController = controller;
      },
      requestUpdate,
    } as unknown as ReactiveControllerHost;
    const controller = new KeyedAsyncController(host, () => [] as number[]);
    registeredController!.hostConnected?.();
    const first = deferred<number[]>();
    const second = deferred<number[]>();
    const firstLoader = vi.fn(() => first.promise);

    controller.load("first", firstLoader);
    controller.load("first", firstLoader);
    controller.load("second", () => second.promise);
    first.resolve([1]);
    await first.promise;
    expect(controller.value).toEqual([]);
    expect(firstLoader).toHaveBeenCalledOnce();

    second.resolve([2]);
    await second.promise;
    expect(controller.value).toEqual([2]);
    expect(controller.status).toBe("ready");

    const disconnected = deferred<number[]>();
    controller.load("third", () => disconnected.promise);
    registeredController!.hostDisconnected?.();
    disconnected.resolve([3]);
    await disconnected.promise;
    expect(controller.value).toEqual([2]);
  });
});
