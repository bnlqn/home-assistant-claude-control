import type { WidgetType } from "../config/schema.js";
import { widgetDefinition } from "./widget-definition.js";

const definitionLoads = new Map<WidgetType, Promise<unknown>>();

function loadDefinition(type: WidgetType): void {
  if (definitionLoads.has(type)) return;
  const definition = widgetDefinition(type);
  const load = definition.load().catch((error) => {
    console.error(`[widget-registry] failed to load "${type}":`, error);
  });
  definitionLoads.set(type, load);
}

export function widgetTag(type: WidgetType): string {
  const definition = widgetDefinition(type);
  // Custom elements upgrade automatically once their module resolves. The
  // dashboard can therefore render the stable tag immediately while loading
  // the widget implementation only when its type is actually present.
  loadDefinition(type);
  return definition.tag;
}
