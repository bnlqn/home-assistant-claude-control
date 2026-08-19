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
