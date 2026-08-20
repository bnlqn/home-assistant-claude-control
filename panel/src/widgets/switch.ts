import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { renderPlainWidgetFrame } from "./plain-widget-frame.js";

@define("hd-widget-switch")
export class SwitchWidget extends EntityWidget {
  renderContent() {
    return renderPlainWidgetFrame(this, { quickKind: "toggle", hasDetail: true });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-switch": SwitchWidget;
  }
}
