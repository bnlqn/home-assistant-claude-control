import { define } from "../primitives/registry.js";
import { MomentaryWidget } from "./momentary-widget.js";

@define("hd-widget-scene")
export class SceneWidget extends MomentaryWidget {}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-scene": SceneWidget;
  }
}
