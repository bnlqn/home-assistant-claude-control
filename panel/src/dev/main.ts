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

// ---- Energy power-flow demo scenarios (dev-only; never shipped) ----
// Each sets the sensors the powerflow widget reads so the diagram can be
// exercised in every state. Units matter: P1/GoodWe/house are W, Tesla is kW.
const W = { unit_of_measurement: "W" } as const;
const KW = { unit_of_measurement: "kW" } as const;
function scenario(name: "export" | "import" | "car") {
  if (name === "export") {
    controller.setEntity("sensor.p1_meter_power", "-900", W);
    controller.setEntity("sensor.goodwe_pv_power", "2400", W);
    controller.setEntity("sensor.house_power_consumption", "1500", W);
    controller.setEntity("sensor.tesla_wall_connector_status", "not_connected");
    controller.setEntity("sensor.other_tesla_model_3_charging", "disconnected");
    controller.setEntity("sensor.tesla_wall_connector_total_power", "0", KW);
  } else if (name === "import") {
    controller.setEntity("sensor.p1_meter_power", "1800", W);
    controller.setEntity("sensor.goodwe_pv_power", "0", W);
    controller.setEntity("sensor.house_power_consumption", "1800", W);
    controller.setEntity("sensor.tesla_wall_connector_status", "not_connected");
    controller.setEntity("sensor.other_tesla_model_3_charging", "disconnected");
    controller.setEntity("sensor.tesla_wall_connector_total_power", "0", KW);
  } else {
    // Car charging on solar surplus.
    controller.setEntity("sensor.p1_meter_power", "-200", W);
    controller.setEntity("sensor.goodwe_pv_power", "6000", W);
    controller.setEntity("sensor.house_power_consumption", "1300", W);
    controller.setEntity("sensor.tesla_wall_connector_status", "charging");
    controller.setEntity("sensor.other_tesla_model_3_charging", "charging");
    controller.setEntity("sensor.tesla_wall_connector_total_power", "4.5", KW);
  }
}
// Baseline energy entities the Energy hero / tiles / total read (dev-only).
const KWH = { unit_of_measurement: "kWh", device_class: "energy" } as const;
controller.setEntity("sensor.whole_home_energy_daily_usage", "6.6", KWH); // Grid stat
controller.setEntity("sensor.goodwe_today_s_pv_generation", "6.4", KWH); // Solar stat
controller.setEntity("sensor.other_tesla_model_3_battery_level", "75", {
  unit_of_measurement: "%",
  device_class: "battery",
} as const);
controller.setEntity("binary_sensor.tesla_wall_connector_vehicle_connected", "on");
controller.setEntity("sensor.p1_meter_energy_import", "9.8", KWH);
controller.setEntity("sensor.p1_meter_energy_export", "3.2", KWH);

scenario("export"); // lively default so the Energy view looks alive on load

// Tiny dev toolbar (dev-only; never shipped).
const bar = document.createElement("div");
bar.style.cssText =
  "position:fixed;right:10px;bottom:10px;z-index:9999;display:flex;gap:6px;font:12px/1 system-ui;flex-wrap:wrap;justify-content:flex-end;max-width:60vw;";
const mk = (label: string, fn: () => void) => {
  const b = document.createElement("button");
  b.textContent = label;
  b.style.cssText =
    "padding:8px 10px;border-radius:8px;border:1px solid rgba(128,128,128,.4);background:#000a;color:#fff;cursor:pointer;";
  b.onclick = fn;
  return b;
};
let online = true;
bar.appendChild(mk("☀ Export", () => scenario("export")));
bar.appendChild(mk("⚡ Import", () => scenario("import")));
bar.appendChild(mk("🚗 Car", () => scenario("car")));
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
