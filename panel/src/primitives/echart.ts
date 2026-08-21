import { LitElement, css, html } from "lit";
import { property } from "lit/decorators.js";
import { define } from "./registry.js";
import * as echarts from "echarts/core";
import { BarChart, LineChart, CustomChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  LegendComponent,
  GraphicComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts";

echarts.use([
  BarChart,
  LineChart,
  CustomChart,
  GridComponent,
  TooltipComponent,
  MarkLineComponent,
  LegendComponent,
  GraphicComponent,
  CanvasRenderer,
]);

/** Re-export the graphic helpers so widgets can build gradients without a second echarts import. */
export const graphic = echarts.graphic;
export type { EChartsOption };

type EChartsInstance = ReturnType<typeof echarts.init>;

/**
 * Thin, theme-agnostic Lit wrapper around an Apache ECharts canvas. It owns only
 * the imperative lifecycle — init, `setOption`, resize, dispose — and lives
 * happily in shadow DOM (canvas needs no global CSS, unlike SVG chart libs).
 * Every widget passes a fully-resolved `option`; styling/theming is the caller's
 * job so charts read from the same design tokens as the rest of the panel.
 */
@define("hd-echart")
export class HdEChart extends LitElement {
  @property({ attribute: false }) option: EChartsOption = {};

  private _chart?: EChartsInstance;
  private _ro?: ResizeObserver;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .box {
      width: 100%;
      height: 100%;
      min-height: 0;
    }
  `;

  firstUpdated(): void {
    const box = this.renderRoot.querySelector(".box") as HTMLElement;
    this._chart = echarts.init(box, undefined, { renderer: "canvas" });
    this._chart.setOption(this.option);
    this._ro = new ResizeObserver(() => this._chart?.resize());
    this._ro.observe(box);
  }

  updated(changed: Map<string, unknown>): void {
    if (changed.has("option") && this._chart) {
      // notMerge so removing a series / markLine actually clears it.
      this._chart.setOption(this.option, { notMerge: true });
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = undefined;
    this._chart?.dispose();
    this._chart = undefined;
  }

  /** Escape hatch for tests / imperative callers. */
  get chart(): EChartsInstance | undefined {
    return this._chart;
  }

  render() {
    return html`<div class="box"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-echart": HdEChart;
  }
}
