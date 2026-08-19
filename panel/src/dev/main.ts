import "../panel/home-dashboard-panel.js";
import type { HomeDashboardPanel } from "../panel/home-dashboard-panel.js";
import { MockHassController } from "./mock-hass.js";

/**
 * Vite dev harness. Mounts the real panel element with a mock `hass` and a mock
 * panel/route contract, so the whole dashboard runs in the browser exactly as
 * it will inside Home Assistant — just without a live connection.
 */
const controller = new MockHassController();
const app = document.getElementById("app")!;

const panel = document.createElement("home-dashboard-panel") as HomeDashboardPanel;
panel.panel = {
  component_name: "home-dashboard-panel",
  icon: "mdi:home",
  title: "Home",
  config: { default_view: "overview" },
  url_path: "home-dashboard",
};
panel.route = { prefix: "/home-dashboard", path: window.location.pathname.replace(/^\/home-dashboard/, "") };
panel.narrow = window.innerWidth < 720;
panel.hass = controller.build();
app.appendChild(panel);

// Re-feed a fresh hass snapshot whenever the mock state changes.
controller.onChange(() => {
  panel.hass = controller.build();
});

// Tiny dev toolbar (dev-only; never shipped) to exercise offline behaviour.
const bar = document.createElement("div");
bar.style.cssText =
  "position:fixed;right:10px;bottom:10px;z-index:9999;display:flex;gap:6px;font:12px/1 system-ui;";
const mk = (label: string, fn: () => void) => {
  const b = document.createElement("button");
  b.textContent = label;
  b.style.cssText =
    "padding:8px 10px;border-radius:8px;border:1px solid rgba(128,128,128,.4);background:#000a;color:#fff;cursor:pointer;";
  b.onclick = fn;
  return b;
};
let online = true;
bar.appendChild(
  mk("Toggle offline", function (this: void) {
    online = !online;
    controller.setConnected(online);
  }),
);
document.body.appendChild(bar);

// Keep the mock route in sync when navigating within the panel.
window.addEventListener("location-changed", () => {
  panel.route = { prefix: "/home-dashboard", path: window.location.pathname.replace(/^\/home-dashboard/, "") };
});
