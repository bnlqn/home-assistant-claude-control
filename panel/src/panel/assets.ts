/** Resolve a Vite-public asset in both the dev harness and Home Assistant. */
export function panelAssetUrl(
  path: string,
  dev = (import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV === true,
): string {
  const cleanPath = path.replace(/^\/+/, "");
  return dev ? `/${cleanPath}` : `/local/home-dashboard/${cleanPath}`;
}
