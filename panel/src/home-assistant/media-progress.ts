import type { HassEntity } from "../types/hass.js";
import { formatDuration } from "./state-formatting.js";

export interface MediaProgress {
  pct: number;
  elapsed: string;
  total: string;
  positionSec: number;
  durationSec: number;
}

/**
 * Playback progress from media_position/duration, advancing the reported
 * position by the time elapsed since it was last updated (as HA's own media
 * card does). Returns null when the player exposes no usable duration.
 *
 * Shared by the media widget's scrubber and the detail surface.
 */
export function mediaProgress(s: HassEntity | undefined): MediaProgress | null {
  const duration = s?.attributes.media_duration as number | undefined;
  if (!s || !duration || duration <= 0) return null;
  let position = (s.attributes.media_position as number) ?? 0;
  const updated = s.attributes.media_position_updated_at as string | undefined;
  if (s.state === "playing" && updated) {
    position += (Date.now() - new Date(updated).getTime()) / 1000;
  }
  position = Math.max(0, Math.min(position, duration));
  return {
    pct: (position / duration) * 100,
    elapsed: formatDuration(position),
    total: formatDuration(duration),
    positionSec: position,
    durationSec: duration,
  };
}
