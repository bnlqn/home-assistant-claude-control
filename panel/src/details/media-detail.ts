import { html, nothing, type TemplateResult } from "lit";
import { mediaCaps } from "../home-assistant/capabilities.js";
import { appIcon, isAppLauncher, splitFeaturedApps } from "../home-assistant/media-apps.js";
import { mediaProgress } from "../home-assistant/media-progress.js";
import {
  buildMediaMute,
  buildMediaNext,
  buildMediaPlayPause,
  buildMediaPrevious,
  buildMediaSelectSource,
  buildMediaSelectSoundMode,
  buildMediaVolume,
  buildToggle,
  buildTurnOn,
} from "../home-assistant/service-calls.js";
import { formatState } from "../home-assistant/state-formatting.js";
import type { HassEntity } from "../types/hass.js";
import type { DetailContext } from "./detail-context.js";

export function renderMediaDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const caps = mediaCaps(state);
  const picture = state.attributes.entity_picture as string | undefined;
  const title = state.attributes.media_title as string | undefined;
  const app = state.attributes.app_name as string | undefined;
  const volume = (state.attributes.volume_level as number) ?? 0;
  const muted = (state.attributes.is_volume_muted as boolean) ?? false;
  const sources = (state.attributes.source_list as string[]) ?? [];
  const soundModes = (state.attributes.sound_mode_list as string[]) ?? [];
  const off = state.state === "off";
  const isApps = caps.selectSource && isAppLauncher(sources);
  const { featured, rest } = isApps
    ? splitFeaturedApps(sources)
    : { featured: [], rest: sources };
  const launch = async (source: string) => {
    if (off) await ctx.call(buildTurnOn(ctx.entityId), "turn on");
    await ctx.call(
      buildMediaSelectSource(ctx.entityId, source),
      isApps ? "launch" : "change source of",
    );
  };
  const playing = !off && state.state !== "idle" && state.state !== "standby";
  const artIcon = app ? appIcon(app) : undefined;
  const progress = mediaProgress(state);

  return html`
    ${picture
      ? html`<div class="media-art" style=${`background-image:url("${picture}")`}></div>`
      : playing && (artIcon || app)
        ? html`<div class="media-art media-art-fallback">
            <hd-icon icon=${artIcon ?? "mdi:television-classic"} .size=${56}></hd-icon>
            ${app ? html`<span>${app}</span>` : nothing}
          </div>`
        : nothing}
    <div class="media-meta">
      <div class="d-value">${title ?? app ?? formatState(ctx.hass, state)}</div>
      ${app && title ? html`<div class="d-sub">${app}</div>` : nothing}
    </div>
    ${progress
      ? html`<div class="d-section media-progress">
          <div class="media-progress-bar"><span style=${`width:${progress.pct}%`}></span></div>
          <div class="media-progress-time">
            <span>${progress.elapsed}</span><span>${progress.total}</span>
          </div>
        </div>`
      : nothing}
    <div class="d-section media-transport">
      ${caps.power
        ? html`<hd-icon-button
            icon="mdi:power"
            label=${off ? "Turn on" : "Turn off"}
            variant=${off ? "soft" : "filled"}
            @click=${() => ctx.call(buildToggle(ctx.entityId), off ? "turn on" : "turn off")}
          ></hd-icon-button>`
        : nothing}
      ${caps.previous
        ? html`<hd-icon-button
            icon="mdi:skip-previous"
            label="Previous"
            variant="soft"
            .disabled=${off}
            @click=${() => ctx.call(buildMediaPrevious(ctx.entityId), "skip")}
          ></hd-icon-button>`
        : nothing}
      <hd-icon-button
        icon=${state.state === "playing" ? "mdi:pause" : "mdi:play"}
        label="Play or pause"
        variant="filled"
        .disabled=${off}
        @click=${() => ctx.call(buildMediaPlayPause(ctx.entityId), "control")}
      ></hd-icon-button>
      ${caps.next
        ? html`<hd-icon-button
            icon="mdi:skip-next"
            label="Next"
            variant="soft"
            .disabled=${off}
            @click=${() => ctx.call(buildMediaNext(ctx.entityId), "skip")}
          ></hd-icon-button>`
        : nothing}
    </div>
    ${caps.volumeSet
      ? html`<div class="d-section">
          <span class="d-label">Volume</span>
          <div class="vol-row">
            ${caps.mute
              ? html`<hd-icon-button
                  icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}
                  label="Mute"
                  variant="soft"
                  @click=${() => ctx.call(buildMediaMute(ctx.entityId, !muted), "mute")}
                ></hd-icon-button>`
              : nothing}
            <hd-slider
              style="flex:1"
              .value=${Math.round(volume * 100)}
              .valueText=${`${Math.round(volume * 100)}%`}
              label="Volume"
              @hd-change=${(event: CustomEvent) => ctx.call(
                buildMediaVolume(ctx.entityId, event.detail.value / 100),
                "set volume of",
              )}
            ></hd-slider>
          </div>
        </div>`
      : nothing}
    ${caps.selectSoundMode && soundModes.length
      ? html`<div class="d-section">
          <span class="d-label">Sound mode</span>
          <div class="chips">
            ${soundModes.map(
              (mode) => html`<button
                class="chip ${state.attributes.sound_mode === mode ? "active" : ""}"
                @click=${() => ctx.call(
                  buildMediaSelectSoundMode(ctx.entityId, mode),
                  "set sound mode of",
                )}
              >${mode}</button>`,
            )}
          </div>
        </div>`
      : nothing}
    ${featured.length
      ? html`<div class="d-section">
          <span class="d-label">Apps</span>
          <div class="media-apps big-buttons">
            ${featured.map(
              (item) => html`<button
                class="bigbtn app ${state.attributes.source === item.source ? "active" : ""}"
                @click=${() => launch(item.source)}
              >
                <hd-icon icon=${item.icon} .size=${26}></hd-icon><span>${item.label}</span>
              </button>`,
            )}
          </div>
        </div>`
      : nothing}
    ${caps.selectSource && rest.length
      ? html`<div class="d-section">
          <span class="d-label">${isApps ? (featured.length ? "More apps" : "Apps") : "Source"}</span>
          <div class="chips">
            ${rest.slice(0, 24).map((source) => {
              const active = state.attributes.source === source;
              const icon = isApps ? (appIcon(source) ?? "mdi:apps") : undefined;
              return html`<button
                class="chip ${icon ? "with-icon" : ""} ${active ? "active" : ""}"
                @click=${() => launch(source)}
              >
                ${icon ? html`<hd-icon icon=${icon} .size=${18}></hd-icon>` : nothing}
                <span>${source}</span>
              </button>`;
            })}
          </div>
        </div>`
      : nothing}
  `;
}
