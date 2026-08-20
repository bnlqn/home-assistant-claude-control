import type { WidgetConfig } from "../config/schema.js";
import type { ServiceCall } from "../home-assistant/service-calls.js";
import type { HomeAssistant } from "../types/hass.js";

/** Shared capabilities supplied by the adaptive detail surface to a renderer. */
export interface DetailContext {
  hass: HomeAssistant;
  entityId: string;
  config?: WidgetConfig;
  host: HTMLElement;
  trend: number[];
  forecast: Array<{
    datetime: string;
    condition?: string;
    temperature?: number;
    templow?: number;
  }>;
  /** Execute a service call with surface-owned feedback and error handling. */
  call: (call: ServiceCall, verb?: string) => Promise<void>;
}
