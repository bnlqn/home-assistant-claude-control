import type { ReactiveController, ReactiveControllerHost } from "lit";

export type AsyncStatus = "idle" | "loading" | "ready" | "error";

/**
 * Run one async request per stable key. Results from superseded requests or a
 * disconnected host are ignored, preventing stale data from repainting a tile.
 */
export class KeyedAsyncController<Value> implements ReactiveController {
  value: Value;
  status: AsyncStatus = "idle";
  error: unknown;

  private key = "";
  private generation = 0;
  private connected = false;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly initialValue: () => Value,
  ) {
    this.value = initialValue();
    host.addController(this);
  }

  hostConnected(): void {
    this.connected = true;
  }

  hostDisconnected(): void {
    this.connected = false;
    this.generation += 1;
    if (this.status === "loading") {
      this.status = "idle";
      this.key = "";
    }
  }

  load(key: string, loader: () => Promise<Value>): void {
    if (!key || (key === this.key && (this.status === "loading" || this.status === "ready"))) return;
    this.key = key;
    this.status = "loading";
    this.error = undefined;
    const generation = ++this.generation;
    void loader().then(
      (value) => {
        if (!this.connected || generation !== this.generation) return;
        this.value = value;
        this.status = "ready";
        this.host.requestUpdate();
      },
      (error: unknown) => {
        if (!this.connected || generation !== this.generation) return;
        this.error = error;
        this.status = "error";
        this.host.requestUpdate();
      },
    );
  }

  reset(): void {
    this.generation += 1;
    this.key = "";
    this.status = "idle";
    this.error = undefined;
    this.value = this.initialValue();
    this.host.requestUpdate();
  }
}
