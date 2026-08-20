import { css, html, nothing } from "lit";
import { state } from "lit/decorators.js";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { mediaCaps } from "../home-assistant/capabilities.js";
import { appIcon } from "../home-assistant/media-apps.js";
import { mediaProgress } from "../home-assistant/media-progress.js";
import {
  cachedArtworkColor,
  darken,
  extractArtworkColor,
  rgbCss,
  type RGB,
} from "../home-assistant/artwork-color.js";
import {
  buildMediaNext,
  buildMediaPlayPause,
  buildMediaPrevious,
} from "../home-assistant/service-calls.js";
import "./widget-frame.js";
import "../primitives/icon-button.js";

const NEUTRAL: RGB = { r: 32, g: 36, b: 44 };
const OPTIMISTIC_MS = 1600;

/**
 * Media player widget. A polished ambient now-playing card: the artwork tints
 * the whole tile (blurred art + colour-sampled scrim), with a live progress
 * scrubber, optimistic play/pause, and marquee titles. A compact bar at 2×1 /
 * 1×2 and a full artwork hero at 2×2; off/idle players show a clean resting
 * state. Volume, source and app launching live in the detail surface.
 */
@define("hd-widget-media")
export class MediaWidget extends EntityWidget {
  @state() private _artColor: RGB | null = null;
  private _colorFor = "";
  private _optimistic: "playing" | "paused" | null = null;
  private _optimisticTs = 0;
  private _tick = 0;
  @state() private _marquee = false;
  private _marqueeRaf = 0;
  private _marqueeKey = "";

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    .transport {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ---- Ambient now-playing card (shared by bar + hero) ---- */
    .np {
      position: relative;
      height: 100%;
      min-height: 96px;
      overflow: hidden;
      color: #fff;
      isolation: isolate;
      background: var(--np-dark);
    }
    .np-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      z-index: 0;
    }
    .np[data-variant="bar"] .np-bg {
      transform: scale(1.4);
      filter: blur(26px) saturate(1.5);
    }
    .np-scrim {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
    .np[data-variant="bar"] .np-scrim {
      background: linear-gradient(90deg, var(--np-scrim-strong) 0%, var(--np-scrim-soft) 100%);
    }
    .np[data-variant="hero"] .np-scrim {
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 25%, var(--np-scrim-strong) 100%);
    }

    /* Bar layout (compact): artwork spans two rows on the left; the title gets
       the full remaining width on top, transport sits on its own row beneath —
       so the title is no longer choked into a marquee-only slit. */
    .np[data-variant="bar"] .np-body {
      position: relative;
      z-index: 2;
      height: 100%;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      grid-template-rows: auto auto;
      align-content: center;
      column-gap: 14px;
      row-gap: 9px;
      padding: 12px 16px;
    }
    .np-art {
      flex: none;
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background-size: cover;
      background-position: center;
      background-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.85);
    }
    .np[data-variant="bar"] .np-art {
      grid-row: 1 / span 2;
      align-self: center;
      width: 66px;
      height: 66px;
      border-radius: 14px;
    }
    .np-meta {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .np[data-variant="bar"] .np-meta {
      grid-column: 2;
      grid-row: 1;
      align-self: end;
    }
    .np-app {
      font: var(--text-meta);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: rgba(255, 255, 255, 0.72);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .np-title {
      font: var(--text-widget-title);
      font-weight: 650;
      color: #fff;
      overflow: hidden;
      white-space: nowrap;
    }
    .np-title-inner {
      display: inline-block;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: bottom;
    }
    .np-title[data-marquee="on"] .np-title-inner {
      max-width: none;
      text-overflow: clip;
      animation: marquee var(--marq-dur, 8s) linear infinite alternate;
    }
    /* A soft trailing-edge fade so a scrolling title dissolves out instead of
       hard-clipping against the meta column. Bar variant only; the leading
       edge stays crisp so the first glyph never looks dimmed at rest. */
    .np[data-variant="bar"] .np-title[data-marquee="on"] {
      -webkit-mask-image: linear-gradient(90deg, #000 calc(100% - 18px), transparent 100%);
      mask-image: linear-gradient(90deg, #000 calc(100% - 18px), transparent 100%);
    }
    @keyframes marquee {
      0%,
      12% {
        transform: translateX(0);
      }
      88%,
      100% {
        transform: translateX(var(--marq-shift, 0));
      }
    }
    .np-transport {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap: 4px;
      --icon-fg: #fff;
    }
    .np[data-variant="bar"] .np-transport {
      grid-column: 2;
      grid-row: 2;
      align-self: start;
      justify-content: flex-start;
      gap: 6px;
      margin-left: -6px;
    }
    .np-transport hd-icon-button {
      color: #fff;
    }
    .np-play {
      width: 46px;
      height: 46px;
      border-radius: var(--radius-pill);
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.16);
      backdrop-filter: blur(6px);
    }

    /* Hero layout (2×2): meta + transport anchored to the bottom. */
    .np[data-variant="hero"] .np-body {
      position: relative;
      z-index: 2;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 12px;
      padding: 18px;
    }
    .np[data-variant="hero"] .np-art {
      display: none;
    }
    .np[data-variant="hero"] .np-title {
      font-size: 17px;
      white-space: normal;
    }
    .np[data-variant="hero"] .np-title-inner {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      white-space: normal;
      animation: none;
    }

    .np-progress {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 4px;
      z-index: 3;
      height: 3px;
      border-radius: var(--radius-pill);
      background: rgba(255, 255, 255, 0.22);
    }
    .np[data-variant="hero"] .np-progress {
      left: 18px;
      right: 18px;
      bottom: 78px;
      border-radius: var(--radius-pill);
    }
    .np-progress span {
      display: block;
      height: 100%;
      background: #fff;
      border-radius: var(--radius-pill);
    }

    @media (prefers-reduced-motion: reduce) {
      .np-title[data-marquee="on"] .np-title-inner {
        animation: none;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }
  `;

  // ---- Playback state ----------------------------------------------------
  private get _rawState(): string {
    return this.vm.rawState;
  }

  /** Live playing state, honouring a recent optimistic toggle. */
  private get _isPlaying(): boolean {
    const live = this._rawState === "playing";
    if (this._optimistic != null) {
      if (Date.now() - this._optimisticTs > OPTIMISTIC_MS) {
        this._optimistic = null;
        return live;
      }
      const want = this._optimistic === "playing";
      if (live === want) {
        this._optimistic = null;
        return live;
      }
      return want;
    }
    return live;
  }

  private _playPause() {
    if (!this.entityId) return;
    this._optimistic = this._isPlaying ? "paused" : "playing";
    this._optimisticTs = Date.now();
    void this.callService(buildMediaPlayPause(this.entityId), { errorVerb: "control" });
  }

  // ---- Lifecycle ---------------------------------------------------------
  protected override willUpdate(): void {
    const picture = this.vm.stateObj?.attributes.entity_picture as string | undefined;
    // Sample the artwork colour once per URL; cache-hit is synchronous.
    if (picture && this._colorFor !== picture) {
      this._colorFor = picture;
      const cached = cachedArtworkColor(picture);
      if (cached !== undefined) {
        this._artColor = cached;
      } else {
        void extractArtworkColor(picture).then((c) => {
          if (this._colorFor === picture) this._artColor = c;
        });
      }
    } else if (!picture && this._colorFor) {
      this._colorFor = "";
      this._artColor = null;
    }
  }

  protected override updated(): void {
    this._syncTicker();
    this._scheduleMarqueeCheck();
  }

  /** Measure after Lit's update lifecycle so a marquee state change is clean. */
  private _scheduleMarqueeCheck(): void {
    if (this._marqueeRaf) return;
    this._marqueeRaf = requestAnimationFrame(() => {
      this._marqueeRaf = 0;
      this._checkMarquee();
    });
  }

  /** Advance the scrubber once a second while actually playing. */
  private _syncTicker() {
    const running = this._isPlaying && !!mediaProgress(this.vm.stateObj);
    if (running && !this._tick) {
      this._tick = window.setInterval(() => this.requestUpdate(), 1000);
    } else if (!running && this._tick) {
      window.clearInterval(this._tick);
      this._tick = 0;
    }
  }

  private _checkMarquee() {
    const np = this.renderRoot.querySelector(".np") as HTMLElement | null;
    const el = this.renderRoot.querySelector(".np-title") as HTMLElement | null;
    const inner = el?.querySelector(".np-title-inner") as HTMLElement | null;
    // Hero wraps to two lines instead of scrolling; only the bar marquees.
    if (!el || !inner || np?.getAttribute("data-variant") === "hero") {
      this._marqueeKey = " ";
      if (this._marquee) this._marquee = false;
      return;
    }
    // Measure only when the title (or width bucket) changes — never every
    // progress tick — so we don't force layout each second (RO-loop churn).
    const key = `${inner.textContent ?? ""}@${el.clientWidth}`;
    if (key === this._marqueeKey) return;
    this._marqueeKey = key;
    const overflow = inner.scrollWidth - el.clientWidth;
    const shouldScroll = overflow > 6;
    if (shouldScroll) {
      el.style.setProperty("--marq-shift", `-${overflow}px`);
      el.style.setProperty("--marq-dur", `${Math.max(6, Math.round(overflow / 22))}s`);
    }
    if (shouldScroll !== this._marquee) this._marquee = shouldScroll;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) window.clearInterval(this._tick);
    this._tick = 0;
    cancelAnimationFrame(this._marqueeRaf);
    this._marqueeRaf = 0;
  }

  // ---- Rendering ---------------------------------------------------------
  private _ambientVars(): string {
    const base = this._artColor ?? NEUTRAL;
    const dark = darken(base, 0.62);
    return [
      `--np-dark:${rgbCss(dark)}`,
      `--np-scrim-strong:${rgbCss(darken(base, 0.55), 0.9)}`,
      `--np-scrim-soft:${rgbCss(darken(base, 0.35), 0.45)}`,
    ].join(";");
  }

  private _transport(caps: ReturnType<typeof mediaCaps>) {
    const vm = this.vm;
    const dis = !vm.available || this._rawState === "off";
    const buffering = this._rawState === "buffering";
    return html`<div class="np-transport" @click=${(e: Event) => e.stopPropagation()}>
      ${caps.previous
        ? html`<hd-icon-button
            icon="mdi:skip-previous"
            label="Previous"
            variant="plain"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildMediaPrevious(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>`
        : nothing}
      <span class="np-play">
        <hd-icon-button
          icon=${this._isPlaying ? "mdi:pause" : "mdi:play"}
          label="Play or pause"
          variant="plain"
          .loading=${buffering}
          .disabled=${dis || (!caps.play && !caps.pause)}
          @click=${() => this._playPause()}
        ></hd-icon-button>
      </span>
      ${caps.next
        ? html`<hd-icon-button
            icon="mdi:skip-next"
            label="Next"
            variant="plain"
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildMediaNext(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>`
        : nothing}
    </div>`;
  }

  renderContent() {
    const vm = this.vm;
    const caps = mediaCaps(vm.stateObj);
    const size = this.currentSize;
    const picture = vm.stateObj?.attributes.entity_picture as string | undefined;
    const app = vm.stateObj?.attributes.app_name as string | undefined;
    const title = vm.stateObj?.attributes.media_title as string | undefined;
    const state = this._rawState;

    const artIcon = app ? appIcon(app) : undefined;
    const hasMedia = !!(picture || app || title);
    const resting = state === "off" || ((state === "idle" || state === "standby") && !hasMedia);

    // Off / idle with nothing on: a clean resting tile, not the ambient card.
    if (resting) {
      return html`
        <hd-widget-frame
          .icon=${vm.icon}
          .name=${vm.name}
          .stateText=${state === "off" ? "Off" : "Not playing"}
          .secondary=${vm.secondary ?? ""}
          .size=${size}
          .accent=${vm.accent}
          .active=${false}
          .unavailable=${!vm.available}
          .hasDetail=${true}
          .quickKind=${"none"}
          @hd-activate=${() => this.openDetail()}
        >
          ${caps.play || caps.pause ? this._transportPlain(caps) : nothing}
        </hd-widget-frame>
      `;
    }

    const isHero = size === "2x2";
    const progress = mediaProgress(vm.stateObj);
    const bg = picture ? `background-image:url("${picture}")` : "";

    return html`
      <hd-widget-frame
        bleed
        .name=${vm.name}
        .size=${size}
        .accent=${vm.accent}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        <div class="np" data-variant=${isHero ? "hero" : "bar"} style=${this._ambientVars()}>
          <div class="np-bg" style=${bg}></div>
          <div class="np-scrim"></div>
          <div class="np-body">
            <div class="np-art" style=${isHero ? "" : bg}>
              ${picture ? nothing : html`<hd-icon icon=${artIcon ?? "mdi:music-note"} .size=${isHero ? 56 : 26}></hd-icon>`}
            </div>
            <div class="np-meta">
              <div class="np-app">${app ?? vm.name}</div>
              <div class="np-title" data-marquee=${this._marquee && !isHero ? "on" : "off"}>
                <span class="np-title-inner">${title ?? vm.displayState}</span>
              </div>
            </div>
            ${this._transport(caps)}
          </div>
          ${progress
            ? html`<div class="np-progress"><span style=${`width:${progress.pct}%`}></span></div>`
            : nothing}
        </div>
      </hd-widget-frame>
    `;
  }

  /** Neutral transport for the resting tile (soft buttons on a light card). */
  private _transportPlain(caps: ReturnType<typeof mediaCaps>) {
    const dis = !this.vm.available;
    return html`<div class="transport" @click=${(e: Event) => e.stopPropagation()}>
      <hd-icon-button
        icon=${this._isPlaying ? "mdi:pause" : "mdi:play"}
        label="Play or pause"
        variant="filled"
        .disabled=${dis || (!caps.play && !caps.pause)}
        @click=${() => this._playPause()}
      ></hd-icon-button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-media": MediaWidget;
  }
}
