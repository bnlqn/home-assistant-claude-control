/**
 * Maps a media_player source/app name to a recognizable launcher glyph, so an
 * Apple-TV-style source list reads as an app grid and a playing app that hides
 * its artwork (Infuse, Netflix, …) can still fall back to its own icon.
 * Source/app names can carry non-breaking spaces (e.g. "App Store"), so
 * normalise before lookup.
 */
const APP_ICONS: Record<string, string> = {
  netflix: "mdi:netflix",
  youtube: "mdi:youtube",
  "youtube tv": "mdi:youtube-tv",
  "prime video": "mdi:filmstrip",
  "hbo max": "mdi:movie-roll",
  max: "mdi:movie-roll",
  skyshowtime: "mdi:movie-open-play",
  disney: "mdi:movie-open-play",
  "disney+": "mdi:movie-open-play",
  infuse: "mdi:play-box-multiple",
  auvio: "mdi:television-classic",
  "pilot wp": "mdi:television-classic",
  tv: "mdi:television-classic",
  music: "mdi:music",
  podcasts: "mdi:podcast",
  photos: "mdi:image-multiple",
  fitness: "mdi:heart-pulse",
  arcade: "mdi:controller-classic",
  facetime: "mdi:video-outline",
  computers: "mdi:laptop",
  "app store": "mdi:apple",
  settings: "mdi:cog",
  search: "mdi:magnify",
  nordvpn: "mdi:vpn",
  speedtest: "mdi:speedometer",
};

/** Icon for an exact source/app name, or undefined when unknown. */
export function appIcon(name: string): string | undefined {
  return APP_ICONS[name.replace(/ /g, " ").trim().toLowerCase()];
}

/** True when a source list looks like an app launcher (Apple TV & friends). */
export function isAppLauncher(sources: readonly string[]): boolean {
  return sources.some((s) => appIcon(s) !== undefined);
}

function normalizeApp(name: string): string {
  return name.replace(/ /g, " ").trim().toLowerCase();
}

/**
 * The streaming apps promoted to big primary launcher tiles in the media detail
 * (bigger, branded, moved out of the generic apps chip list). Matched against
 * the player's `source_list` by normalised name; order here is the display
 * order. `key` is the source name to match; `label` overrides the display text.
 */
export interface FeaturedApp {
  key: string;
  label: string;
  icon: string;
}

export const FEATURED_APPS: readonly FeaturedApp[] = [
  { key: "tv", label: "Apple TV+", icon: "mdi:apple" },
  { key: "infuse", label: "Infuse", icon: "mdi:play-box-multiple" },
  { key: "netflix", label: "Netflix", icon: "mdi:netflix" },
] as const;

/** A featured app resolved against a real source name present in the list. */
export interface ResolvedFeaturedApp extends FeaturedApp {
  /** The exact source_list entry to pass to select_source. */
  source: string;
}

/**
 * Split a source list into the featured launcher apps (in FEATURED_APPS order)
 * and the remaining sources, so the detail can render featured apps as primary
 * tiles and everything else in the secondary chip list without duplication.
 */
export function splitFeaturedApps(sources: readonly string[]): {
  featured: ResolvedFeaturedApp[];
  rest: string[];
} {
  const byNorm = new Map<string, string>();
  for (const src of sources) {
    const n = normalizeApp(src);
    if (!byNorm.has(n)) byNorm.set(n, src);
  }
  const featured: ResolvedFeaturedApp[] = [];
  const claimed = new Set<string>();
  for (const app of FEATURED_APPS) {
    const source = byNorm.get(app.key);
    if (source) {
      featured.push({ ...app, source });
      claimed.add(source);
    }
  }
  const rest = sources.filter((s) => !claimed.has(s));
  return { featured, rest };
}
