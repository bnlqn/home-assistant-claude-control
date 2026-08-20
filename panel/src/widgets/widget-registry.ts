import type { WidgetType } from "../config/schema.js";

// Side-effect imports register every widget custom element.
import "./group.js";
import "./light.js";
import "./basic.js";
import "./sensor.js";
import "./climate.js";
import "./cover.js";
import "./media.js";
import "./vacuum.js";
import "./weather.js";
import "./energy.js";
import "./powerflow.js";
import "./solarcharging.js";
import "./energychart.js";
import "./metric-tile.js";
import "./electricity-total.js";
import "./extra.js";

/** Maps a configured widget `type` to its custom-element tag. */
export const WIDGET_TAGS: Record<WidgetType, string> = {
  group: "hd-group",
  light: "hd-widget-light",
  switch: "hd-widget-switch",
  fan: "hd-widget-fan",
  climate: "hd-widget-climate",
  cover: "hd-widget-cover",
  media: "hd-widget-media",
  sensor: "hd-widget-sensor",
  binary_sensor: "hd-widget-binary",
  person: "hd-widget-person",
  scene: "hd-widget-scene",
  script: "hd-widget-script",
  button: "hd-widget-button",
  lock: "hd-widget-lock",
  vacuum: "hd-widget-vacuum",
  camera: "hd-widget-camera",
  weather: "hd-widget-weather",
  energy: "hd-widget-energy",
  powerflow: "hd-widget-powerflow",
  solarcharging: "hd-widget-solarcharging",
  energychart: "hd-widget-energychart",
  metrictile: "hd-widget-metrictile",
  electricitytotal: "hd-widget-electricitytotal",
  alarm: "hd-widget-alarm",
  action: "hd-widget-action",
};

export function widgetTag(type: WidgetType): string {
  return WIDGET_TAGS[type] ?? "hd-widget-sensor";
}
