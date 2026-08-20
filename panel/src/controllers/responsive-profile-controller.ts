import type { ReactiveController, ReactiveControllerHost } from "lit";

type ResponsiveHost = ReactiveControllerHost & HTMLElement;

/** Observe container width and expose its resolved responsive profile. */
export class ResponsiveProfileController<Profile> implements ReactiveController {
  width = 0;

  private observer?: ResizeObserver;
  private frame = 0;
  private pendingWidth = 0;

  constructor(
    private readonly host: ResponsiveHost,
    private readonly resolve: (width: number) => Profile,
  ) {
    host.addController(this);
  }

  get profile(): Profile {
    return this.resolve(this.width);
  }

  hostConnected(): void {
    this.width = Math.round(this.host.getBoundingClientRect().width || window.innerWidth);
    this.observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry?.contentRect.width ?? 0);
      if (!width || Math.abs(width - this.width) <= 1) return;
      this.pendingWidth = width;
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        const next = this.pendingWidth;
        if (!next || Math.abs(next - this.width) <= 1) return;
        this.width = next;
        this.host.requestUpdate();
      });
    });
    this.observer.observe(this.host);
  }

  hostDisconnected(): void {
    this.observer?.disconnect();
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
}
