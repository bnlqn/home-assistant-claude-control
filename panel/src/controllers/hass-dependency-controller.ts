import type { ReactiveController, ReactiveControllerHost } from "lit";
import type { HomeAssistant } from "../types/hass.js";

/** Compare only the Home Assistant state objects a host actually depends on. */
export class HassDependencyController implements ReactiveController {
  constructor(
    host: ReactiveControllerHost,
    private readonly dependencyIds: () => readonly string[],
  ) {
    host.addController(this);
  }

  hostConnected(): void {}

  hasChanged(previous: HomeAssistant | undefined, current: HomeAssistant | undefined): boolean {
    if (!previous || !current) return true;
    if (previous.connected !== current.connected) return true;
    return [...new Set(this.dependencyIds())]
      .some((entityId) => previous.states[entityId] !== current.states[entityId]);
  }
}
