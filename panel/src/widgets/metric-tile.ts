import { css, html, nothing, type TemplateResult } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import type { MetricTileWidgetOptions } from "../config/widget-options.js";
import { accentVars } from "../home-assistant/entity-adapters/index.js";
import { FLOW_DEADBAND_W, isCarActive, isCarConnected, toWatts } from "../home-assistant/energy-flow.js";
import { formatNumber, formatState } from "../home-assistant/state-formatting.js";
import "../primitives/entity-icon.js";

/**
 * A Homey-style energy status tile: a chip-less accent-colored glyph, a bold
 * name, and a `value • status` line (e.g. "467 W • Importing", "57% • Charging").
 *
 * Deliberately NOT built on `hd-widget-frame` — the Homey tile has a plain
 * colored glyph with no icon container, which the frame's icon button can't
 * express. It still extends `EntityWidget` for state-gated re-renders and the
 * shared detail-open behavior, and reads every entity from its config/options.
 */
@define("hd-widget-metrictile")
export class MetricTileWidget extends EntityWidget {
  private get _opts(): MetricTileWidgetOptions {
    return this.config.type === "metrictile" ? this.config.options ?? {} : {};
  }

  protected override relevantEntityIds(): string[] {
    const o = this._opts;
    return [this.config.entity, o.chargeStatus, o.connected].filter((v): v is string => typeof v === "string");
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .tile {
      -webkit-tap-highlight-color: transparent;
      appearance: none;
      border: none;
      text-align: left;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      background: var(--surface);
      border-radius: var(--radius-widget);
      box-shadow: var(--shadow-widget);
      padding: 13px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      color: inherit;
      transition: box-shadow var(--motion-state) var(--ease-standard);
    }
    .tile:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
    .glyph {
      flex: none;
      width: 26px;
      display: grid;
      place-items: center;
      color: var(--glyph, var(--idle-fg));
    }
    .text {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .name {
      font: var(--text-widget-title);
      font-weight: 700;
      line-height: 1.15;
      color: var(--text-primary);
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .sub {
      font: var(--text-secondary-state);
      color: var(--text-secondary);
      font-variant-numeric: tabular-nums;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    :host([data-unavailable="true"]) .tile {
      opacity: 0.72;
      cursor: default;
    }
  `;

  private _valueText(): string {
    const o = this._opts;
    const st = this.entityId ? this.hass?.states[this.entityId] : undefined;
    if (!st) return "—";
    if (o.format === "power") {
      const w = toWatts(st);
      if (w == null) return "—";
      const abs = Math.abs(w);
      return abs >= 1000 ? `${formatNumber(abs / 1000)} kW` : `${Math.round(abs)} W`;
    }
    if (o.format === "percent") {
      const n = Number(st.state);
      return Number.isFinite(n) ? `${Math.round(n)}%` : "—";
    }
    return formatState(this.hass, st);
  }

  private _statusText(): string {
    const o = this._opts;
    if (o.status === "gridDirection") {
      const st = this.entityId ? this.hass?.states[this.entityId] : undefined;
      const w = st ? toWatts(st) : null;
      if (w == null) return "";
      if (w > FLOW_DEADBAND_W) return "Importing";
      if (w < -FLOW_DEADBAND_W) return "Exporting";
      return "Balanced";
    }
    if (o.status === "carCharge") {
      const chargeState = o.chargeStatus ? this.hass?.states[o.chargeStatus]?.state : undefined;
      const plug = o.connected ? this.hass?.states[o.connected]?.state : undefined;
      const plugged = plug === "on" || isCarConnected(chargeState);
      if (!plugged) return "Disconnected";
      if (isCarActive(chargeState)) return "Charging";
      return "Plugged in";
    }
    return "";
  }

  renderContent(): TemplateResult {
    const o = this._opts;
    const glyph = accentVars(o.accent ?? "idle").fg;
    const st = this.entityId ? this.hass?.states[this.entityId] : undefined;
    const unavailable = !st || st.state === "unavailable" || st.state === "unknown";
    this.setAttribute("data-unavailable", unavailable ? "true" : "false");

    const value = this._valueText();
    const status = this._statusText();
    const sub = status ? `${value} • ${status}` : value;

    return html`
      <button
        class="tile"
        style=${`--glyph:${glyph}`}
        aria-label=${`${this.config.name ?? ""} details`}
        @click=${() => this.openDetail()}
      >
        <span class="glyph">
          <hd-icon .icon=${this.config.icon ?? "mdi:flash"} .size=${24}></hd-icon>
        </span>
        <span class="text">
          <span class="name">${this.config.name ?? ""}</span>
          <span class="sub">${sub}</span>
        </span>
        ${nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-metrictile": MetricTileWidget;
  }
}
