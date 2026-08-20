import type { ReactiveController, ReactiveControllerHost } from "lit";

type WidthHost = ReactiveControllerHost & HTMLElement;

/**
 * Observe a component's content width without mutating Lit state inside the
 * ResizeObserver delivery cycle. Deferring the update to the next frame avoids
 * observer-loop notifications when responsive rendering changes layout.
 */
export class ElementWidthController implements ReactiveController {
  width = 0;

  private _observer?: ResizeObserver;
  private _frame = 0;
  private _pendingWidth = 0;

  constructor(private readonly host: WidthHost) {
    host.addController(this);
  }

  hostConnected(): void {
    this.width = Math.round(this.host.getBoundingClientRect().width || window.innerWidth);
    this._observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry?.contentRect.width ?? 0);
      if (!width || Math.abs(width - this.width) <= 1) return;
      this._pendingWidth = width;
      if (this._frame) return;
      this._frame = requestAnimationFrame(() => {
        this._frame = 0;
        const next = this._pendingWidth;
        if (!next || Math.abs(next - this.width) <= 1) return;
        this.width = next;
        this.host.requestUpdate();
      });
    });
    this._observer.observe(this.host);
  }

  hostDisconnected(): void {
    this._observer?.disconnect();
    cancelAnimationFrame(this._frame);
    this._frame = 0;
  }
}
