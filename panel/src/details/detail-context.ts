import type { WidgetConfig } from "../config/schema.js";
import type { HistoryPoint } from "../home-assistant/history.js";
import type { ServiceCall } from "../home-assistant/service-calls.js";
import type { HomeAssistant } from "../types/hass.js";

/** Shared capabilities supplied by the adaptive detail surface to a renderer. */
export interface DetailContext {
  hass: HomeAssistant;
  entityId: string;
  config?: WidgetConfig;
  host: HTMLElement;
  /** 24 h numeric history values (for min/max summaries and compact trends). */
  trend: number[];
  /** The same history with timestamps, for a full axed chart in the dialog. */
  trendPoints: HistoryPoint[];
  /** Unit of the trended entity (e.g. "°C", "W"), for the chart's value axis. */
  trendUnit: string;
  forecast: Array<{
    datetime: string;
    condition?: string;
    temperature?: number;
    templow?: number;
  }>;
  /** Execute a service call with surface-owned feedback and error handling. */
  call: (call: ServiceCall, verb?: string) => Promise<void>;
}
