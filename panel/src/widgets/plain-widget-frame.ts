import { html, type TemplateResult } from "lit";
import type { WidgetSize } from "../config/schema.js";
import type { EntityWidget } from "./base-widget.js";
import type { ActionState } from "./widget-frame.js";
import "./widget-frame.js";

interface PlainWidgetAccess {
  currentSize: WidgetSize;
  actionState: ActionState;
  runQuick(): void;
  openDetail(): void;
}

/** Shared frame for glanceable entity widgets with no custom body. */
export function renderPlainWidgetFrame(
  widget: EntityWidget,
  options: { quickKind: "toggle" | "activate" | "none"; hasDetail: boolean },
): TemplateResult {
  const vm = widget.vm;
  const access = widget as unknown as PlainWidgetAccess;
  return html`<hd-widget-frame
    .icon=${vm.icon}
    .name=${vm.name}
    .stateText=${vm.displayState}
    .secondary=${vm.secondary ?? ""}
    .size=${access.currentSize}
    .layout=${widget.layout}
    .accent=${vm.accent}
    .active=${vm.active}
    .unavailable=${!vm.available}
    .hasDetail=${options.hasDetail}
    .quickKind=${options.quickKind}
    .quickLabel=${vm.quickAction.label}
    .actionState=${access.actionState}
    @hd-quick=${() => access.runQuick()}
    @hd-activate=${() => access.openDetail()}
  ></hd-widget-frame>`;
}
