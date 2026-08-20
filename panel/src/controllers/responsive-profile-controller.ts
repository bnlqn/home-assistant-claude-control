import type { ReactiveController, ReactiveControllerHost } from "lit";

type ResponsiveHost = ReactiveControllerHost & HTMLElement;

/** Observe container width plus viewport height and expose a resolved profile. */
export class ResponsiveProfileController<Profile> implements ReactiveController {
  width = 0;
  height = 0;

  private observer?: ResizeObserver;
  private frame = 0;
  private pendingWidth = 0;
  private pendingHeight = 0;

  constructor(
    private readonly host: ResponsiveHost,
    private readonly resolve: (width: number, height: number) => Profile,
  ) {
    host.addController(this);
  }

  get profile(): Profile {
    return this.resolve(this.width, this.height);
  }

  hostConnected(): void {
    this.width = Math.round(this.host.getBoundingClientRect().width || window.innerWidth);
    this.height = Math.round(window.innerHeight || this.host.getBoundingClientRect().height);
    window.addEventListener("resize", this.onWindowResize);
    this.observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry?.contentRect.width ?? 0);
      this.schedule(width, window.innerHeight);
    });
    this.observer.observe(this.host);
  }

  hostDisconnected(): void {
    this.observer?.disconnect();
    window.removeEventListener("resize", this.onWindowResize);
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  private readonly onWindowResize = () => {
    const width = Math.round(this.host.getBoundingClientRect().width || window.innerWidth);
    this.schedule(width, window.innerHeight);
  };

  private schedule(width: number, height: number): void {
    const nextWidth = Math.round(width || 0);
    const nextHeight = Math.round(height || 0);
    const widthChanged = nextWidth > 0 && Math.abs(nextWidth - this.width) > 1;
    const heightChanged = nextHeight > 0 && Math.abs(nextHeight - this.height) > 1;
    if (!widthChanged && !heightChanged) return;
    this.pendingWidth = nextWidth || this.width;
    this.pendingHeight = nextHeight || this.height;
    if (this.frame) return;
    this.frame = requestAnimationFrame(() => {
      this.frame = 0;
      const changed = Math.abs(this.pendingWidth - this.width) > 1 ||
        Math.abs(this.pendingHeight - this.height) > 1;
      if (!changed) return;
      this.width = this.pendingWidth;
      this.height = this.pendingHeight;
      this.host.requestUpdate();
    });
  }
}
