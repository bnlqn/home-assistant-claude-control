import { css, html, nothing } from "lit";
import { define } from "../primitives/registry.js";
import { EntityWidget } from "./base-widget.js";
import { mediaCaps } from "../home-assistant/capabilities.js";
import {
  buildMediaNext,
  buildMediaPlayPause,
  buildMediaPrevious,
} from "../home-assistant/service-calls.js";
import "./widget-frame.js";
import "../primitives/icon-button.js";

/**
 * Media player widget. Compact transport at 2×1; a rich artwork tile at 2×2.
 * Transport buttons appear only for the capabilities the player advertises;
 * volume, source and sound-mode selection live in the detail surface.
 */
@define("hd-widget-media")
export class MediaWidget extends EntityWidget {
  static styles = css`
    .transport {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .transport.compact {
      justify-content: flex-start;
    }

    /* 2x2 artwork tile */
    .art-tile {
      position: relative;
      height: 100%;
      min-height: 160px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #fff;
      background: linear-gradient(135deg, #2b2f3a, #171a20);
      background-size: cover;
      background-position: center;
    }
    .scrim {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.05) 30%, rgba(0, 0, 0, 0.78) 100%);
    }
    .no-art {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      color: rgba(255, 255, 255, 0.6);
    }
    .overlay {
      position: relative;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .meta .app {
      font: var(--text-meta);
      opacity: 0.85;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .meta .title {
      font: var(--text-widget-title);
      font-weight: 650;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .overlay .transport {
      --icon-fg: #fff;
    }
    .overlay hd-icon-button {
      color: #fff;
    }
  `;

  private _playPauseIcon(): string {
    return this.vm.rawState === "playing" ? "mdi:pause" : "mdi:play";
  }

  private _transport(caps: ReturnType<typeof mediaCaps>, onDark: boolean) {
    const vm = this.vm;
    const dis = !vm.available || vm.rawState === "off";
    const btnVar = onDark ? "plain" : "soft";
    return html`<div
      class="transport ${onDark ? "" : "compact"}"
      @click=${(e: Event) => e.stopPropagation()}
    >
      ${caps.previous
        ? html`<hd-icon-button
            icon="mdi:skip-previous"
            label="Previous"
            variant=${btnVar}
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildMediaPrevious(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>`
        : nothing}
      <hd-icon-button
        icon=${this._playPauseIcon()}
        label="Play or pause"
        variant=${onDark ? "soft" : "filled"}
        .disabled=${dis || (!caps.play && !caps.pause)}
        @click=${() => this.entityId && this.callService(buildMediaPlayPause(this.entityId), { errorVerb: "control" })}
      ></hd-icon-button>
      ${caps.next
        ? html`<hd-icon-button
            icon="mdi:skip-next"
            label="Next"
            variant=${btnVar}
            .disabled=${dis}
            @click=${() => this.entityId && this.callService(buildMediaNext(this.entityId), { errorVerb: "skip" })}
          ></hd-icon-button>`
        : nothing}
    </div>`;
  }

  render() {
    const vm = this.vm;
    const caps = mediaCaps(vm.stateObj);
    const size = this.currentSize;
    const picture = vm.stateObj?.attributes.entity_picture as string | undefined;
    const app = vm.stateObj?.attributes.app_name as string | undefined;
    const title = vm.stateObj?.attributes.media_title as string | undefined;

    if (size === "2x2") {
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
          <div class="art-tile" style=${bg}>
            ${picture ? nothing : html`<div class="no-art"><hd-icon icon="mdi:music-note" .size=${44}></hd-icon></div>`}
            <div class="scrim"></div>
            <div class="overlay">
              <div class="meta">
                <div class="app">${app ?? vm.name}</div>
                <div class="title">${title ?? vm.displayState}</div>
              </div>
              ${this._transport(caps, true)}
            </div>
          </div>
        </hd-widget-frame>
      `;
    }

    return html`
      <hd-widget-frame
        .icon=${vm.icon}
        .name=${vm.name}
        .stateText=${vm.displayState}
        .secondary=${vm.secondary ?? ""}
        .size=${size}
        .accent=${vm.accent}
        .active=${vm.active}
        .unavailable=${!vm.available}
        .hasDetail=${true}
        .quickKind=${"none"}
        @hd-activate=${() => this.openDetail()}
      >
        ${this._transport(caps, false)}
      </hd-widget-frame>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hd-widget-media": MediaWidget;
  }
}
