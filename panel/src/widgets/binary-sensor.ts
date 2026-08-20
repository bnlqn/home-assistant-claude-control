import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { renderPlainWidgetFrame } from "./plain-widget-frame.js";
import "./widget-frame.js";

@define("hd-widget-binary")
export class BinarySensorWidget extends EntityWidget {
  renderContent() {
    return renderPlainWidgetFrame(this, { quickKind: "none", hasDetail: true });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-binary": BinarySensorWidget;
  }
}
