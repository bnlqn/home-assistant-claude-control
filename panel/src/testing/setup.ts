// jsdom polyfills for browser APIs the components touch. Keeps component tests
// from crashing on APIs jsdom doesn't implement.

if (!("ResizeObserver" in globalThis)) {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;
}

if (!globalThis.matchMedia) {
  (globalThis as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return false;
    },
  });
  // Mirror onto window for components that read window.matchMedia.
  (window as unknown as { matchMedia: unknown }).matchMedia = (globalThis as unknown as { matchMedia: unknown }).matchMedia;
}

if (!("requestAnimationFrame" in globalThis)) {
  (globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 0) as unknown as number;
  (globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = (id: number) => clearTimeout(id);
}
