import { define } from "../primitives/registry.js";
import { MomentaryWidget } from "./momentary-widget.js";

@define("hd-widget-script")
export class ScriptWidget extends MomentaryWidget {}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-script": ScriptWidget;
  }
}
