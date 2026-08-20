import type { WidgetConfig } from "../config/schema.js";

/** Resolve the entity whose 24-hour history enriches an open detail surface. */
export function detailNeedsHistory(entityId: string, config?: WidgetConfig): string | null {
  if (config?.type === "energy") return config.options?.gridPower ?? null;
  if (config?.type === "powerflow") return config.options?.gridPower ?? null;
  return entityId.split(".")[0] === "sensor" ? entityId : null;
}

/** Weather details request a forecast while open. */
export function detailNeedsForecast(entityId: string): boolean {
  return entityId.split(".")[0] === "weather";
}
