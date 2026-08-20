import { define } from "../primitives/registry.js";
import { MomentaryWidget } from "./momentary-widget.js";

@define("hd-widget-button")
export class ButtonWidget extends MomentaryWidget {}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-button": ButtonWidget;
  }
}
