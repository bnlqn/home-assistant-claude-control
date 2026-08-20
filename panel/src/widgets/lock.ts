import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { renderPlainWidgetFrame } from "./plain-widget-frame.js";

@define("hd-widget-lock")
export class LockWidget extends EntityWidget {
  renderContent() {
    return renderPlainWidgetFrame(this, { quickKind: "toggle", hasDetail: true });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-lock": LockWidget;
  }
}
