/**
 * Extracts a representative "ambient" colour from a piece of media artwork so
 * the now-playing card can tint itself like the Sonos / Apple Music cards.
 *
 * Home Assistant serves entity_picture same-origin (/api/media_player_proxy/…),
 * so a canvas read is not tainted; anything that *is* cross-origin/tainted, or
 * fails to load, resolves to `null` and the card falls back to a neutral dark
 * gradient. Results are cached per URL — extraction runs at most once per image.
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

const cache = new Map<string, RGB | null>();
const pending = new Map<string, Promise<RGB | null>>();

/** Synchronous cache peek: `undefined` = not computed yet. */
export function cachedArtworkColor(url: string): RGB | null | undefined {
  return cache.get(url);
}

/** Extract (or return cached) ambient colour for an artwork URL. */
export function extractArtworkColor(url: string): Promise<RGB | null> {
  if (cache.has(url)) return Promise.resolve(cache.get(url) ?? null);
  const inFlight = pending.get(url);
  if (inFlight) return inFlight;

  const p = load(url)
    .then((c) => {
      cache.set(url, c);
      pending.delete(url);
      return c;
    })
    .catch(() => {
      cache.set(url, null);
      pending.delete(url);
      return null;
    });
  pending.set(url, p);
  return p;
}

function load(url: string): Promise<RGB | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(sample(img));
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Downscale to a small canvas and pick a colour that favours mid-luminance,
 * saturated pixels (the "poster" colour), blended toward the average to stay
 * stable. Falls back to a plain average, then null on a tainted/empty read.
 */
function sample(img: HTMLImageElement): RGB | null {
  const size = 24;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let ar = 0;
    let ag = 0;
    let ab = 0;
    let n = 0;
    let best: RGB | null = null;
    let bestScore = -1;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (data[i + 3] < 200) continue;
      ar += r;
      ag += g;
      ab += b;
      n += 1;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const lum = (max + min) / 2;
      const sat = max === 0 ? 0 : (max - min) / max;
      const score = sat * (1 - Math.abs(lum - 140) / 140);
      if (score > bestScore) {
        bestScore = score;
        best = { r, g, b };
      }
    }
    if (!n) return null;
    const avg = { r: (ar / n) | 0, g: (ag / n) | 0, b: (ab / n) | 0 };
    if (best && bestScore > 0.15) {
      return {
        r: (best.r * 0.6 + avg.r * 0.4) | 0,
        g: (best.g * 0.6 + avg.g * 0.4) | 0,
        b: (best.b * 0.6 + avg.b * 0.4) | 0,
      };
    }
    return avg;
  } catch {
    return null; // tainted canvas (cross-origin without CORS)
  }
}

/** Clamp + darken an RGB toward black by `f` (0..1). */
export function darken({ r, g, b }: RGB, f: number): RGB {
  const k = 1 - f;
  return { r: (r * k) | 0, g: (g * k) | 0, b: (b * k) | 0 };
}

export function rgbCss({ r, g, b }: RGB, alpha = 1): string {
  return alpha >= 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
