import type { WidgetType } from "../config/schema.js";
import { widgetDefinition } from "./widget-definition.js";

// Side-effect imports register every widget custom element.
import "./group.js";
import "./basic.js";
import "./sensor.js";
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
type LegacyWidgetType = Exclude<WidgetType, "light" | "climate">;

const LEGACY_WIDGET_TAGS: Record<LegacyWidgetType, string> = {
  group: "hd-group",
  switch: "hd-widget-switch",
  fan: "hd-widget-fan",
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

const definitionLoads = new Map<WidgetType, Promise<unknown>>();

function loadDefinition(type: WidgetType): void {
  if (definitionLoads.has(type)) return;
  const definition = widgetDefinition(type);
  if (!definition) return;
  const load = definition.load().catch((error) => {
    console.error(`[widget-registry] failed to load "${type}":`, error);
  });
  definitionLoads.set(type, load);
}

export function widgetTag(type: WidgetType): string {
  const definition = widgetDefinition(type);
  if (definition) {
    // Custom elements upgrade automatically once their module resolves. The
    // dashboard can therefore render the stable tag immediately while loading
    // the widget implementation only when its type is actually present.
    loadDefinition(type);
    return definition.tag;
  }
  return LEGACY_WIDGET_TAGS[type as LegacyWidgetType] ?? "hd-widget-sensor";
}
