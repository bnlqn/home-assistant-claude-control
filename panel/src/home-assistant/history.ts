import type { HomeAssistant } from "../types/hass.js";

/**
 * Lazy history access. Only called by open detail surfaces / visible trend
 * widgets — never on first render, never polled. Uses the modern WS
 * `history/history_during_period` with a REST fallback.
 */
export interface HistoryPoint {
  t: number; // epoch ms
  value: number;
}

export async function fetchNumericHistory(
  hass: HomeAssistant,
  entityId: string,
  hoursBack = 24,
): Promise<HistoryPoint[]> {
  const end = new Date();
  const start = new Date(end.getTime() - hoursBack * 3600 * 1000);

  try {
    const res = await hass.callWS<Record<string, Array<{ s?: string; state?: string; lu?: number; lc?: number }>>>({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      entity_ids: [entityId],
      minimal_response: true,
      no_attributes: true,
    });
    const rows = res?.[entityId] ?? [];
    return rows
      .map((r) => ({
        t: (r.lu ?? r.lc ?? 0) * 1000,
        value: Number(r.s ?? r.state),
      }))
      .filter((p) => Number.isFinite(p.value) && p.t > 0);
  } catch {
    // Fallback to REST history endpoint (older cores / restricted WS).
    try {
      const path = `history/period/${start.toISOString()}?filter_entity_id=${encodeURIComponent(
        entityId,
      )}&minimal_response&no_attributes&end_time=${encodeURIComponent(end.toISOString())}`;
      const res = await hass.callApi<Array<Array<{ state: string; last_updated: string }>>>("GET", path);
      const rows = res?.[0] ?? [];
      return rows
        .map((r) => ({ t: new Date(r.last_updated).getTime(), value: Number(r.state) }))
        .filter((p) => Number.isFinite(p.value) && p.t > 0);
    } catch {
      return [];
    }
  }
}
