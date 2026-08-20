import { html, nothing, type TemplateResult } from "lit";
import { coverCaps, vacuumCaps } from "../home-assistant/capabilities.js";
import {
  buildCoverClose,
  buildCoverOpen,
  buildCoverPosition,
  buildCoverStop,
  buildLock,
  buildTurnOff,
  buildTurnOn,
  buildUnlock,
  buildVacuumFanSpeed,
  buildVacuumLocate,
  buildVacuumPause,
  buildVacuumReturn,
  buildVacuumStart,
} from "../home-assistant/service-calls.js";
import {
  formatNumber,
  formatState,
  relativeTime,
  titleCase,
} from "../home-assistant/state-formatting.js";
import {
  CONSUMABLE_LOW_HOURS,
  vacuumCompanions,
} from "../home-assistant/vacuum-companions.js";
import { requestConfirm } from "../primitives/feedback.js";
import type { HassEntity } from "../types/hass.js";
import type { DetailContext } from "./detail-context.js";
import { renderDetailMeta } from "./detail-meta.js";

export function renderCoverDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const caps = coverCaps(state);
  const position = (state.attributes.current_position as number) ??
    (state.state === "open" ? 100 : 0);
  return html`
    ${caps.setPosition
      ? html`<div class="d-section">
          <span class="d-label">Position</span>
          <hd-slider
            .value=${position}
            .valueText=${`${Math.round(position)}% open`}
            label="Position"
            @hd-change=${(event: CustomEvent) => ctx.call(
              buildCoverPosition(ctx.entityId, event.detail.value),
              "move",
            )}
          ></hd-slider>
        </div>`
      : nothing}
    <div class="d-section big-buttons">
      ${caps.open
        ? html`<button
            class="bigbtn"
            @click=${() => ctx.call(buildCoverOpen(ctx.entityId), "open")}
          ><hd-icon icon="mdi:arrow-up" .size=${20}></hd-icon>Open</button>`
        : nothing}
      ${caps.stop
        ? html`<button
            class="bigbtn"
            @click=${() => ctx.call(buildCoverStop(ctx.entityId), "stop")}
          ><hd-icon icon="mdi:stop" .size=${20}></hd-icon>Stop</button>`
        : nothing}
      ${caps.close
        ? html`<button
            class="bigbtn"
            @click=${() => ctx.call(buildCoverClose(ctx.entityId), "close")}
          ><hd-icon icon="mdi:arrow-down" .size=${20}></hd-icon>Close</button>`
        : nothing}
    </div>
  `;
}

export function renderLockDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const locked = state.state === "locked";
  const unlock = async () => {
    const confirmed = await requestConfirm(ctx.host, {
      title: `Unlock ${state.attributes.friendly_name ?? "lock"}?`,
      confirmLabel: "Unlock",
      destructive: true,
      icon: "mdi:lock-open-variant",
    });
    if (confirmed) void ctx.call(buildUnlock(ctx.entityId), "unlock");
  };
  return html`
    <div class="d-section big-buttons">
      <button
        class="bigbtn ${locked ? "active" : ""}"
        @click=${() => ctx.call(buildLock(ctx.entityId), "lock")}
      >
        <hd-icon icon="mdi:lock" .size=${20}></hd-icon>Lock
      </button>
      <button class="bigbtn ${!locked ? "active" : ""}" @click=${unlock}>
        <hd-icon icon="mdi:lock-open-variant" .size=${20}></hd-icon>Unlock
      </button>
    </div>
    <div class="d-meta">Last changed ${relativeTime(state.last_changed)}</div>
  `;
}

export function renderVacuumDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const caps = vacuumCaps(state);
  const speeds = ((state.attributes.fan_speed_list as string[]) ?? [])
    .filter((speed) => !["off", "custom"].includes(speed));
  const companions = vacuumCompanions(ctx.hass, ctx.entityId);
  const battery = companions.battery ??
    (state.attributes.battery_level as number | undefined);
  const cleaning = state.state === "cleaning";

  const runStats: Array<[string, string]> = [];
  if (typeof companions.progress === "number" && cleaning) {
    runStats.push(["Progress", `${Math.round(companions.progress)}%`]);
  }
  if (typeof companions.area === "number" && companions.area > 0) {
    runStats.push(["Area", `${formatNumber(companions.area)} m²`]);
  }
  if (typeof companions.cleaningTime === "number" && companions.cleaningTime > 0) {
    runStats.push(["Time", `${Math.round(companions.cleaningTime)} min`]);
  }

  return html`
    <div class="d-section big-buttons">
      <button
        class="bigbtn"
        @click=${() => ctx.call(buildVacuumStart(ctx.entityId), "start")}
      ><hd-icon icon="mdi:play" .size=${20}></hd-icon>Start</button>
      ${caps.pause
        ? html`<button
            class="bigbtn"
            @click=${() => ctx.call(buildVacuumPause(ctx.entityId), "pause")}
          ><hd-icon icon="mdi:pause" .size=${20}></hd-icon>Pause</button>`
        : nothing}
      ${caps.returnHome
        ? html`<button
            class="bigbtn"
            @click=${() => ctx.call(buildVacuumReturn(ctx.entityId), "dock")}
          ><hd-icon icon="mdi:home-import-outline" .size=${20}></hd-icon>Dock</button>`
        : nothing}
      ${caps.locate
        ? html`<button
            class="bigbtn"
            @click=${() => ctx.call(buildVacuumLocate(ctx.entityId), "locate")}
          ><hd-icon icon="mdi:map-marker-radius" .size=${20}></hd-icon>Locate</button>`
        : nothing}
    </div>
    ${speeds.length
      ? html`<div class="d-section">
          <span class="d-label">Suction</span>
          <hd-segmented
            .options=${speeds.map((speed) => ({ value: speed, label: titleCase(speed) }))}
            .value=${(state.attributes.fan_speed as string) ?? ""}
            @hd-select=${(event: CustomEvent) => ctx.call(
              buildVacuumFanSpeed(ctx.entityId, event.detail.value),
              "set suction for",
            )}
          ></hd-segmented>
        </div>`
      : nothing}
    ${runStats.length
      ? html`<div class="d-section">
          <span class="d-label">${cleaning
            ? (companions.room ? `Cleaning ${companions.room}` : "Current clean")
            : "Last clean"}</span>
          <div class="d-grid">
            ${runStats.map(([key, value]) => html`<div class="d-cell">
              <span class="k">${key}</span><span class="v">${value}</span>
            </div>`)}
          </div>
        </div>`
      : nothing}
    ${companions.consumables.length
      ? html`<div class="d-section">
          <span class="d-label">Consumables</span>
          <div class="d-grid">
            ${companions.consumables.map((consumable) => {
              const low = consumable.hoursLeft <= CONSUMABLE_LOW_HOURS;
              return html`<div class="d-cell">
                <span class="k">${consumable.label}</span>
                <span class="v" style=${low ? "color:var(--state-warn)" : ""}>
                  ${Math.round(consumable.hoursLeft)} h${low ? " · replace" : ""}
                </span>
              </div>`;
            })}
          </div>
        </div>`
      : nothing}
    ${battery != null
      ? html`<div class="d-meta">Battery ${Math.round(battery)}%${companions.status
        ? ` · ${titleCase(companions.status.replace(/_/g, " "))}`
        : ""}</div>`
      : nothing}
  `;
}

export function renderGenericDetail(ctx: DetailContext, state: HassEntity): TemplateResult {
  const domain = ctx.entityId.split(".")[0];
  const toggleable = [
    "switch",
    "input_boolean",
    "fan",
    "light",
    "humidifier",
    "siren",
  ].includes(domain);
  return html`
    <div class="d-value big">${formatState(ctx.hass, state)}</div>
    ${toggleable
      ? html`<div class="d-section big-buttons">
          <button
            class="bigbtn"
            @click=${() => ctx.call(buildTurnOn(ctx.entityId), "turn on")}
          >Turn on</button>
          <button
            class="bigbtn"
            @click=${() => ctx.call(buildTurnOff(ctx.entityId), "turn off")}
          >Turn off</button>
        </div>`
      : nothing}
    ${renderDetailMeta(ctx, state)}
  `;
}
