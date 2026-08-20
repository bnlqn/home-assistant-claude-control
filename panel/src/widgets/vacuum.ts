import { css, html, nothing, unsafeCSS } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { vacuumCaps } from "../home-assistant/capabilities.js";
import {
  buildVacuumFanSpeed,
  buildVacuumLocate,
  buildVacuumPause,
  buildVacuumReturn,
  buildVacuumStart,
} from "../home-assistant/service-calls.js";
import { formatNumber, titleCase } from "../home-assistant/state-formatting.js";
import { vacuumCompanions } from "../home-assistant/vacuum-companions.js";
import { panelAssetUrl } from "../panel/assets.js";
import type { SegmentOption } from "../primitives/segmented.js";
import "./widget-frame.js";
import "../primitives/icon-button.js";
import "../primitives/entity-icon.js";
import "../primitives/segmented.js";

/**
 * Roborock "Torch Red" — the official brand primary (#EA0029), paired with the
 * deeper Venetian Red from the same palette for gradient depth.
 * Source: Roborock brand palette (Torch Red RGB 234,0,41 / Venetian Red #7A0015).
 */
const ROBOROCK_RED = "#EA0029";

/** Robot vacuum widget: start / pause / dock, with fan-speed selection at 2×2. */
@define("hd-widget-vacuum")
export class VacuumWidget extends EntityWidget {
  static styles = css`
    .controls {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .fan {
      margin-top: 4px;
    }
    .progress {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .progress .track {
      height: 6px;
      border-radius: var(--radius-pill);
      background: var(--idle-bg);
      overflow: hidden;
    }
    .progress .fill {
      height: 100%;
      border-radius: inherit;
      background: var(--accent-ring, var(--accent));
      transition: width var(--motion-state) var(--ease-standard);
    }
    .progress .meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font: var(--text-meta);
      color: var(--text-tertiary);
      font-variant-numeric: tabular-nums;
    }

    /* ---- Roborock branded hero (2×2) ------------------------------------- */
    .hero {
      position: relative;
      height: 100%;
      width: 100%;
      overflow: hidden;
      color: #fff;
      isolation: isolate;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 18px 20px;
      box-sizing: border-box;
      background: radial-gradient(125% 120% at 12% -10%, #ff2a4d 0%, #ea0029 40%, #a5001b 100%);
    }
    /* readability scrim so white text clears AA on the red */
    .hero::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(118deg, rgba(74, 0, 12, 0.6) 0%, rgba(74, 0, 12, 0) 48%);
      z-index: 0;
    }
    .hero .glow {
      position: absolute;
      right: 0;
      bottom: -6%;
      width: 74%;
      height: 82%;
      background: radial-gradient(closest-side, rgba(255, 255, 255, 0.24), rgba(255, 255, 255, 0) 72%);
      z-index: 0;
      pointer-events: none;
    }
    .hero .robot {
      position: absolute;
      right: -5%;
      bottom: -4%;
      height: 86%;
      width: auto;
      object-fit: contain;
      filter: drop-shadow(0 14px 20px rgba(0, 0, 0, 0.42));
      z-index: 1;
      pointer-events: none;
      user-select: none;
    }
    .hero[data-cleaning] .glow {
      animation: robopulse 3.2s ease-in-out infinite;
    }
    @keyframes robopulse {
      50% {
        opacity: 0.6;
        transform: scale(1.06);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero[data-cleaning] .glow {
        animation: none;
      }
    }
    .hero .top,
    .hero .bottom {
      position: relative;
      z-index: 2;
    }
    .hero .brand {
      font: var(--text-meta);
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: lowercase;
      opacity: 0.9;
    }
    .hero .htext {
      margin-top: 6px;
      max-width: 62%;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .hero .hname {
      font: var(--text-widget-title);
      font-weight: 650;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero .hstatus {
      font: var(--text-secondary-state);
      color: rgba(255, 255, 255, 0.94);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .hero .hmeta {
      font: var(--text-meta);
      color: rgba(255, 255, 255, 0.78);
      font-variant-numeric: tabular-nums;
    }
    .hero .hprogress {
      max-width: 60%;
      margin-bottom: 12px;
    }
    .hero .hprogress .prow {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font: var(--text-meta);
      color: rgba(255, 255, 255, 0.9);
      font-variant-numeric: tabular-nums;
      margin-bottom: 5px;
    }
    .hero .htrack {
      height: 6px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.28);
      overflow: hidden;
    }
    .hero .hfill {
      height: 100%;
      border-radius: inherit;
      background: #fff;
      transition: width var(--motion-state) var(--ease-standard);
    }
    .hero .controls {
      display: flex;
      gap: 8px;
    }
    .hero .pill {
      appearance: none;
      border: none;
      cursor: pointer;
      height: 44px;
      min-width: 44px;
      padding: 0 12px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.17);
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      transition: background var(--motion-state) var(--ease-standard), transform var(--motion-press) var(--ease-standard);
    }
    .hero .pill:hover {
      background: rgba(255, 255, 255, 0.28);
    }
    .hero .pill:active {
      transform: scale(0.93);
    }
    .hero .pill.primary {
      background: #fff;
      color: ${unsafeCSS(ROBOROCK_RED)};
    }
    .hero .pill.primary:hover {
      background: rgba(255, 255, 255, 0.88);
    }
    .hero .pill:disabled {
      opacity: 0.45;
      cursor: default;
      transform: none;
    }
    .hero .pill:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.65);
    }
    @media (prefers-reduced-motion: reduce) {
      .hero .pill:active {
        transform: none;
      }
    }
  `;

  private get _branded(): boolean {
    if (this.config.type !== "vacuum") return false;
    const o = this.config.options ?? {};
    return o.brand === "roborock" || o.branded === true;
  }

  protected relevantEntityIds(): string[] {
    const base = this.entityId ? [this.entityId] : [];
    return [...base, ...vacuumCompanions(this.hass, this.entityId).ids];
  }

  private _progress() {
    const co = vacuumCompanions(this.hass, this.entityId);
    if (this.vm.rawState !== "cleaning" || typeof co.progress !== "number") return nothing;
    const pct = Math.max(0, Math.min(100, Math.round(co.progress)));
    const bits: string[] = [`${pct}%`];
    if (typeof co.area === "number" && co.area > 0) bits.push(`${formatNumber(co.area)} m²`);
    if (typeof co.cleaningTime === "number" && co.cleaningTime > 0) bits.push(`${Math.round(co.cleaningTime)} min`);
    return html`<div class="progress">
      <div class="track"><div class="fill" style=${`width:${pct}%`}></div></div>
      <div class="meta"><span>${bits[0]}</span><span>${bits.slice(1).join(" · ")}</span></div>
    </div>`;
  }

  private _controls(caps: ReturnType<typeof vacuumCaps>) {
    const vm = this.vm;
    const st = vm.rawState;
    const dis = !vm.available;
    const cleaning = st === "cleaning";
    return html`<div class="controls" @click=${(e: Event) => e.stopPropagation()}>
      ${cleaning && caps.pause
        ? html`<hd-icon-button
            icon="mdi:pause"
            label="Pause"
            variant="soft"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildVacuumPause(this.entityId), { errorVerb: "pause" })}
          ></hd-icon-button>`
        : html`<hd-icon-button
            icon="mdi:play"
            label="Start"
            variant="filled"
            .disabled=${dis || !caps.start}
            @click=${() => this.entityId && this.callService(buildVacuumStart(this.entityId), { errorVerb: "start" })}
          ></hd-icon-button>`}
      ${caps.returnHome
        ? html`<hd-icon-button
            icon="mdi:home-import-outline"
            label="Return to dock"
            variant="soft"
            .disabled=${dis || st === "docked"}
            @click=${() => this.entityId && this.callService(buildVacuumReturn(this.entityId), { errorVerb: "dock" })}
          ></hd-icon-button>`
        : nothing}
    </div>`;
  }

  private _fanSpeed() {
    const vm = this.vm;
    const list = (vm.stateObj?.attributes.fan_speed_list as string[] | undefined) ?? [];
    const speeds = list.filter((s) => !["off", "custom"].includes(s));
    if (speeds.length < 2) return nothing;
    const options: SegmentOption[] = speeds.map((s) => ({ value: s, label: titleCase(s) }));
    return html`<div class="fan">
      <hd-segmented
        .options=${options}
        .value=${(vm.stateObj?.attributes.fan_speed as string) ?? ""}
        .disabled=${!vm.available}
        label="Suction power"
        @hd-select=${(e: CustomEvent) =>
          this.entityId && this.callService(buildVacuumFanSpeed(this.entityId, e.detail.value), { errorVerb: "set suction for" })}
      ></hd-segmented>
    </div>`;
  }

  /** Translucent-white transport pills used on the branded hero. */
  private _heroControls(caps: ReturnType<typeof vacuumCaps>) {
    const vm = this.vm;
    const st = vm.rawState;
    const dis = !vm.available;
    const cleaning = st === "cleaning";
    const call = (build: () => ReturnType<typeof buildVacuumStart>, verb: string) =>
      this.entityId && this.callService(build(), { errorVerb: verb });
    return html`<div class="controls" @click=${(e: Event) => e.stopPropagation()}>
      ${cleaning && caps.pause
        ? html`<button class="pill primary" aria-label="Pause" ?disabled=${dis} @click=${() => call(() => buildVacuumPause(this.entityId!), "pause")}>
            <hd-icon icon="mdi:pause" .size=${20}></hd-icon>
          </button>`
        : html`<button class="pill primary" aria-label="Start" ?disabled=${dis || !caps.start} @click=${() => call(() => buildVacuumStart(this.entityId!), "start")}>
            <hd-icon icon="mdi:play" .size=${20}></hd-icon>
          </button>`}
      ${caps.returnHome
        ? html`<button class="pill" aria-label="Return to dock" ?disabled=${dis || st === "docked"} @click=${() => call(() => buildVacuumReturn(this.entityId!), "dock")}>
            <hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>
          </button>`
        : nothing}
      ${caps.locate
        ? html`<button class="pill" aria-label="Locate" ?disabled=${dis} @click=${() => call(() => buildVacuumLocate(this.entityId!), "locate")}>
            <hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>
          </button>`
        : nothing}
    </div>`;
  }

  /** Full-bleed Roborock-branded hero (2×2): red panel + product shot. */
  private _renderHero(caps: ReturnType<typeof vacuumCaps>) {
    const vm = this.vm;
    const co = vacuumCompanions(this.hass, this.entityId);
    const cleaning = vm.rawState === "cleaning";
    const pct =
      cleaning && typeof co.progress === "number" ? Math.max(0, Math.min(100, Math.round(co.progress))) : undefined;
    const metaBits: string[] = [];
    if (co.battery != null) metaBits.push(`${Math.round(co.battery)}%`);
    if (co.area != null && co.area > 0) metaBits.push(`${formatNumber(co.area)} m²`);

    const progress =
      pct != null
        ? html`<div class="hprogress">
            <div class="prow">
              <span>${pct}%</span>
              <span>${co.cleaningTime != null && co.cleaningTime > 0 ? `${Math.round(co.cleaningTime)} min` : ""}</span>
            </div>
            <div class="htrack"><div class="hfill" style=${`width:${pct}%`}></div></div>
          </div>`
        : nothing;

    return html`
      <hd-widget-frame
        bleed
        .size=${this.currentSize}
        .accent=${vm.accent}
        .hasDetail=${true}
        .quickKind=${"none"}
        .unavailable=${!vm.available}
        .actionState=${this.actionState}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="hero" ?data-cleaning=${cleaning}>
          <div class="glow"></div>
          <img
            class="robot"
            src=${panelAssetUrl("assets/roborock-s8.webp")}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <div class="top">
            <div class="brand">roborock</div>
            <div class="htext">
              <span class="hname">${vm.name}</span>
              <span class="hstatus">${vm.displayState}</span>
              ${metaBits.length ? html`<span class="hmeta">${metaBits.join(" · ")}</span>` : nothing}
            </div>
          </div>
          <div class="bottom">
            ${progress}
            ${this._heroControls(caps)}
          </div>
        </div>
      </hd-widget-frame>
    `;
  }

  renderContent() {
    const vm = this.vm;
    const size = this.currentSize;
    const caps = vacuumCaps(vm.stateObj);
    const showControls = size !== "1x1";

    if (this._branded && size === "2x2" && vm.exists) return this._renderHero(caps);

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .layout=${this.layout}
        .name=${vm.name}
        .stateText=${vm.displayState}
        .secondary=${vm.secondary ?? ""}
        .size=${size}
        .accent=${vm.accent}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${size === "1x1" ? "toggle" : "none"}
        .quickLabel=${vm.quickAction.label}
        .actionState=${this.actionState}
        @hd-quick=${() => this.runQuick()}
        @hd-activate=${() => this.openDetail()}
      >
        ${showControls ? this._controls(caps) : nothing} ${size !== "1x1" ? this._progress() : nothing}
        ${size === "2x2" ? this._fanSpeed() : nothing}
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-vacuum": VacuumWidget;
  }
}
