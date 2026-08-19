import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

// The panel builds to a single self-contained ES module that Home Assistant
// loads via `panel_custom` → `module_url`. Everything (including Lit) is
// bundled; no external CDN, font, or network dependency is emitted.
//
// Output lands directly in the Home Assistant working mirror at
// `config/www/home-dashboard/` so it ships through the normal
// `./bin/ha deploy` rsync flow → served at `/local/home-dashboard/`.
export default defineConfig({
  build: {
    outDir: fileURLToPath(new URL("../config/www/home-dashboard", import.meta.url)),
    emptyOutDir: true,
    target: "es2021",
    sourcemap: false,
    lib: {
      entry: fileURLToPath(new URL("./src/panel/home-dashboard-panel.ts", import.meta.url)),
      formats: ["es"],
      fileName: () => "home-dashboard-panel.js",
    },
    rollupOptions: {
      // Bundle everything — nothing is external. A wall-mounted tablet on the
      // local network must load the panel with zero outbound requests.
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
