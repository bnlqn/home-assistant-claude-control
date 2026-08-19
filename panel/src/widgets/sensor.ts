import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { fetchNumericHistory } from "../home-assistant/history.js";
import { accentVars } from "../home-assistant/entity-adapters/index.js";
import "./widget-frame.js";
import "../primitives/misc.js";

/**
 * Sensor / numeric widget. The value is the hero; a lazy 24 h trend appears at
 * 2×2. History is fetched only when a trend is actually shown — never on the
 * first paint of a small tile, never polled.
 */
@define("hd-widget-sensor")
export class SensorWidget extends EntityWidget {
  @state() private _trend: number[] = [];
  private _fetchedFor = "";

  static styles = css`
    .value {
      font: var(--text-value);
      color: var(--text-primary);
      font-variant-numeric: tabular-nums;
      display: flex;
      align-items: baseline;
      gap: 4px;
      overflow: hidden;
    }
    :host([data-big]) .value {
      font: var(--text-value-lg);
    }
    .value .unit {
      font: var(--text-widget-title);
      color: var(--text-secondary);
      font-weight: 600;
    }
    .value .txt {
      font: var(--text-widget-title);
      font-weight: 650;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      white-space: normal;
    }
    .trend {
      height: 46px;
      margin-top: 6px;
    }
  `;

  private get _isBig(): boolean {
    return this.currentSize === "2x2" || this.currentSize === "1x2";
  }

  updated() {
    // Lazily load history only when a trend chart is visible.
    if (this._isBig && this.entityId && this.hass?.connected && this._fetchedFor !== this.entityId) {
      const s = this.hass.states[this.entityId];
      if (s && Number.isFinite(Number(s.state))) {
        this._fetchedFor = this.entityId;
        void this._loadTrend();
      }
    }
    if (this._isBig) this.setAttribute("data-big", "");
    else this.removeAttribute("data-big");
  }

  private async _loadTrend() {
    if (!this.hass || !this.entityId) return;
    const points = await fetchNumericHistory(this.hass, this.entityId, 24);
    this._trend = points.map((p) => p.value);
  }

  renderContent() {
    const vm = this.vm;
    const s = vm.stateObj;
    const num = s ? Number(s.state) : NaN;
    const isNumeric = Number.isFinite(num) && s!.state.trim() !== "";
    const unit = s?.attributes.unit_of_measurement as string | undefined;
    const av = accentVars(vm.accent);

    const valueBlock = !vm.available
      ? html`<div class="value"><span class="txt">${vm.displayState}</span></div>`
      : isNumeric
        ? html`<div class="value">
            <span>${formatNum(num)}</span>${unit ? html`<span class="unit">${unit}</span>` : nothing}
          </div>`
        : html`<div class="value"><span class="txt">${vm.displayState}</span></div>`;

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .name=${vm.name}
        .stateText=${""}
        .size=${this.currentSize}
        .accent=${vm.accent}
        .active=${false}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${valueBlock}
        ${this._isBig && isNumeric && this._trend.length > 1
          ? html`<div class="trend">
              <hd-trend
                .points=${this._trend}
                .color=${av.fg}
                .summary=${`24 hour trend for ${vm.name}`}
              ></hd-trend>
            </div>`
          : nothing}
      </hd-widget-frame>
    `;
  }
}

function formatNum(n: number): string {
  const abs = Math.abs(n);
  const digits = abs >= 100 ? 0 : abs >= 10 ? 1 : 2;
  try {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(n);
  } catch {
    return n.toFixed(digits);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-sensor": SensorWidget;
  }
}
