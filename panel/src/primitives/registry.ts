/**
 * Guarded custom-element registration. The panel bundle can be evaluated more
 * than once (HA re-entry, dev HMR); defining the same tag twice throws. This
 * decorator no-ops on the second definition instead of crashing the panel.
 */
export function define(name: string) {
  return function <T extends CustomElementConstructor>(ctor: T): T {
    if (!customElements.get(name)) {
      customElements.define(name, ctor);
    }
    return ctor;
  };
}
