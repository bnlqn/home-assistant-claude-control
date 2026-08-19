import type { Route } from "../types/hass.js";

/**
 * Tiny path router for the panel's sub-routes. Each view is a real route under
 * the panel base, e.g. /home-dashboard/living-room. We derive the current view
 * id from Home Assistant's `route` (preferred) or the browser location, and
 * navigate with the History API so Back/Forward and refresh all work.
 */

export function viewIdFromRoute(route: Route | undefined, base: string, location = window.location): string {
  // HA passes route.path as the sub-path after the panel prefix ("/living-room").
  if (route && typeof route.path === "string") {
    return stripToId(route.path);
  }
  return viewIdFromPath(location.pathname, base);
}

export function viewIdFromPath(pathname: string, base: string): string {
  const parts = pathname.replace(/^\/+/, "").split("/").filter(Boolean);
  if (parts[0] === base) return parts[1] ?? "";
  // If already relative (no base), take the first segment.
  return parts.length > 1 ? parts[1] : "";
}

function stripToId(subPath: string): string {
  return subPath.replace(/^\/+/, "").split("/").filter(Boolean)[0] ?? "";
}

export function pathForView(base: string, viewId: string, defaultView: string): string {
  if (!viewId || viewId === defaultView) return `/${base}`;
  return `/${base}/${viewId}`;
}

/** Navigate within the panel; updates the URL and notifies HA's router. */
export function navigate(path: string): void {
  if (window.location.pathname === path) return;
  history.pushState(null, "", path);
  // Let Home Assistant (and any listeners) know the location changed.
  window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
}
