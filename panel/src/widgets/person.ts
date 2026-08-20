import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { renderPlainWidgetFrame } from "./plain-widget-frame.js";
import "./widget-frame.js";

@define("hd-widget-person")
export class PersonWidget extends EntityWidget {
  renderContent() {
    return renderPlainWidgetFrame(this, { quickKind: "none", hasDetail: true });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-person": PersonWidget;
  }
}
