import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { sharedA11y } from "../design-system/tokens.js";
import {
  currentEnergyPeriodSelection,
  type EnergyPeriod,
  type EnergyPeriodRange,
} from "./energy-period.js";
import "../primitives/segmented.js";
import "../primitives/icon-button.js";
import "../primitives/entity-icon.js";

/** Page-level navigation intents emitted by the Energy period controls. */
export type EnergyNavDetail =
  | { action: "period"; period: EnergyPeriod }
  | { action: "shift"; offset: -1 | 1 }
  | { action: "today" }
  | { action: "date"; anchor: string };

const PERIOD_OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

/** The recovery button label depends on which period is active. */
const CURRENT_LABEL: Record<EnergyPeriod, string> = {
  day: "Today",
  week: "This week",
  month: "This month",
};

/**
 * The Energy page's period navigation: a Day/Week/Month selector, previous/next
 * stepping, precise date selection, and a "jump to current period" recovery.
 * It renders on the hero's glass bar (white-on-blue), so it re-themes the shared
 * segmented/icon-button primitives through local token overrides rather than
 * forking their accessibility behavior.
 *
 * It owns no state. It reads the resolved {@link EnergyPeriodRange} and emits a
 * single composed `hd-energy-nav` event; the panel's period controller applies
 * every intent and feeds the new range back down.
 */
@define("hd-energy-period-controls")
export class EnergyPeriodControls extends LitElement {
  @property({ attribute: false }) range?: EnergyPeriodRange;
  /** Recorder integrity chip ("Loading" | "Partial" | "Unavailable"). */
  @property({ type: String }) availability: string | null = null;
  @property({ type: String }) timeZone?: string;

  static styles = [
    sharedA11y,
    css`
      :host {
        display: block;
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 8px;
        color: #fff;
      }
      /* Re-theme the shared segmented track for the blue hero glass. */
      .period {
        --surface-sunken: rgba(255, 255, 255, 0.16);
        --surface: #ffffff;
        --text-primary: #16233f;
        --text-secondary: rgba(255, 255, 255, 0.9);
        --shadow-widget: 0 1px 2px rgba(16, 24, 40, 0.16);
        flex: 0 0 auto;
      }
      .nav {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px;
        border-radius: var(--radius-pill);
        background: rgba(255, 255, 255, 0.16);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        /* White chevrons on translucent hover for the stepper buttons. */
        --text-primary: #ffffff;
        --surface-hover: rgba(255, 255, 255, 0.22);
      }
      /* The date trigger is a real, focusable control with an overlaid native
         picker so keyboard and pointer both reach date selection. */
      .date {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 44px;
        padding: 0 14px;
        border-radius: var(--radius-pill);
        color: #fff;
        font: var(--text-widget-title);
        font-weight: 600;
        white-space: nowrap;
      }
      .date:focus-within {
        outline: none;
        box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.35), 0 0 0 4px #fff;
      }
      .date .label {
        pointer-events: none;
      }
      .date .availability {
        pointer-events: none;
        padding: 3px 7px;
        border-radius: var(--radius-pill);
        background: rgba(15, 23, 42, 0.34);
        font: var(--text-meta);
      }
      /* The native date input fills the trigger, transparent, so a tap anywhere
         opens the picker while remaining tab-focusable for keyboard users. */
      .date input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        border: 0;
        opacity: 0;
        cursor: pointer;
        color-scheme: dark;
        font: inherit;
      }
      .date input::-webkit-calendar-picker-indicator {
        cursor: pointer;
      }
      .today {
        -webkit-tap-highlight-color: transparent;
        appearance: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 44px;
        padding: 0 14px;
        border: none;
        border-radius: var(--radius-pill);
        background: rgba(255, 255, 255, 0.9);
        color: #16233f;
        font: var(--text-secondary-state);
        font-weight: 650;
        transition: background var(--motion-press) var(--ease-standard);
      }
      .today:hover {
        background: #ffffff;
      }
      .today:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px rgba(47, 107, 255, 0.35), 0 0 0 4px #fff;
      }
    `,
  ];

  private _emit(detail: EnergyNavDetail): void {
    this.dispatchEvent(
      new CustomEvent<EnergyNavDetail>("hd-energy-nav", {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onPeriod(ev: CustomEvent<{ value: string }>): void {
    this._emit({ action: "period", period: ev.detail.value as EnergyPeriod });
  }

  private _onDate(ev: Event): void {
    const value = (ev.target as HTMLInputElement).value;
    if (value) this._emit({ action: "date", anchor: value });
  }

  render(): TemplateResult {
    const range = this.range;
    const period = range?.selection.period ?? "day";
    const isCurrent = range?.isCurrent ?? true;
    // Future periods are never selectable; the next step is disabled while the
    // selection already contains "now", and the date picker is capped at today.
    const today = currentEnergyPeriodSelection(new Date(), this.timeZone).anchor;
    const anchor = range?.selection.anchor ?? today;
    const label = range?.label ?? "Today";

    return html`
      <div class="controls">
        <hd-segmented
          class="period"
          label="Energy period"
          .options=${PERIOD_OPTIONS}
          .value=${period}
          @hd-select=${this._onPeriod}
        ></hd-segmented>

        <div class="nav">
          <hd-icon-button
            icon="mdi:chevron-left"
            label="Previous ${period}"
            @click=${() => this._emit({ action: "shift", offset: -1 })}
          ></hd-icon-button>

          <div class="date">
            <hd-icon icon="mdi:calendar-blank" .size=${18}></hd-icon>
            <span class="label">${label}</span>
            ${this.availability
              ? html`<span class="availability">${this.availability}</span>`
              : nothing}
            <input
              type="date"
              aria-label="Select ${period}: currently ${label}"
              .value=${anchor}
              max=${today}
              @change=${this._onDate}
            />
          </div>

          <hd-icon-button
            icon="mdi:chevron-right"
            label="Next ${period}"
            ?disabled=${isCurrent}
            @click=${() => this._emit({ action: "shift", offset: 1 })}
          ></hd-icon-button>
        </div>

        ${isCurrent
          ? nothing
          : html`<button
              class="today"
              @click=${() => this._emit({ action: "today" })}
            >
              <hd-icon icon="mdi:calendar-today" .size=${16}></hd-icon>
              ${CURRENT_LABEL[period]}
            </button>`}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-energy-period-controls": EnergyPeriodControls;
  }
}
