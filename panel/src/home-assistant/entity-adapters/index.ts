import type { HassEntity, HomeAssistant } from "../../types/hass.js";
import type { WidgetConfig } from "../../config/schema.js";
import { isPlaceholderEntity } from "../../config/validation.js";
import { domainOf, isUnavailable, isUnknown } from "../capabilities.js";
import { formatState, friendlyName, formatNumber, relativeTime, titleCase } from "../state-formatting.js";
import {
  buildButtonPress,
  buildLock,
  buildSceneActivate,
  buildScriptRun,
  buildToggle,
  buildUnlock,
  buildVacuumReturn,
  buildVacuumStart,
} from "../service-calls.js";
import { vacuumCompanions } from "../vacuum-companions.js";
import { batteryIcon, defaultIcon, weatherIcon } from "./icons.js";
import type { AccentToken, EntityViewModel } from "./model.js";

export type { EntityViewModel, AccentToken, QuickAction } from "./model.js";

const ON_STATES = new Set(["on", "open", "playing", "home", "cleaning", "heat", "cool", "auto", "active"]);

/**
 * Normalize any entity into an `EntityViewModel`. Missing / unavailable /
 * unknown entities produce intentional, renderable states (never a crash).
 */
export function normalizeEntity(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
  config?: WidgetConfig,
): EntityViewModel {
  const fallbackName = config?.name ?? "Unknown";

  if (!entityId) {
    return placeholderModel("", fallbackName, "mdi:help-circle-outline", "Not configured");
  }

  const domain = domainOf(entityId);
  const isPlaceholder = isPlaceholderEntity(entityId);
  const stateObj = hass?.states[entityId];

  if (isPlaceholder) {
    return placeholderModel(entityId, config?.name ?? "Configure me", config?.icon ?? defaultIcon(domain, undefined), "Replace placeholder id");
  }

  if (!stateObj) {
    // Configured but not present in HA (typo, disabled, or not yet loaded).
    return {
      entityId,
      domain,
      exists: false,
      available: false,
      unknown: false,
      isPlaceholder: false,
      name: config?.name ?? titleCase(entityId.split(".")[1] ?? entityId),
      icon: config?.icon ?? defaultIcon(domain, undefined),
      rawState: "missing",
      displayState: "Not found",
      secondary: "Entity unavailable",
      active: false,
      accent: "unavailable",
      quickAction: { kind: "none", label: "Unavailable" },
    };
  }

  const name = config?.name ?? friendlyName(stateObj, titleCase(entityId.split(".")[1] ?? entityId));
  const unavailable = isUnavailable(stateObj);
  const unknown = isUnknown(stateObj);

  const base: EntityViewModel = {
    entityId,
    domain,
    stateObj,
    exists: true,
    available: !unavailable,
    unknown,
    isPlaceholder: false,
    name,
    icon: config?.icon ?? stateObj.attributes.icon ?? defaultIcon(domain, stateObj),
    rawState: stateObj.state,
    displayState: formatState(hass, stateObj),
    active: false,
    accent: unavailable ? "unavailable" : "idle",
    quickAction: { kind: "none", label: name },
  };

  if (unavailable) {
    base.secondary = "Unavailable";
    return base;
  }

  return refineByDomain(base, stateObj, config, hass);
}

function refineByDomain(
  vm: EntityViewModel,
  s: HassEntity,
  config?: WidgetConfig,
  hass?: HomeAssistant,
): EntityViewModel {
  const on = ON_STATES.has(s.state);
  switch (vm.domain) {
    case "light":
      return refineLight(vm, s, config);
    case "switch":
    case "input_boolean":
      vm.active = s.state === "on";
      vm.accent = vm.active ? "accent" : "idle";
      vm.icon = config?.icon ?? s.attributes.icon ?? defaultIcon(vm.domain, s);
      vm.quickAction = { kind: "toggle", label: vm.active ? "Turn off" : "Turn on", call: buildToggle(vm.entityId) };
      return vm;
    case "fan":
      vm.active = s.state === "on";
      vm.accent = vm.active ? "accent" : "idle";
      if (typeof s.attributes.percentage === "number") vm.level = s.attributes.percentage as number;
      vm.secondary = vm.active && vm.level != null ? `${Math.round(vm.level)}%` : undefined;
      vm.quickAction = { kind: "toggle", label: vm.active ? "Turn off" : "Turn on", call: buildToggle(vm.entityId) };
      return vm;
    case "climate":
      return refineClimate(vm, s);
    case "cover":
      return refineCover(vm, s);
    case "media_player":
      return refineMedia(vm, s);
    case "lock":
      return refineLock(vm, s, config);
    case "vacuum":
      return refineVacuum(vm, s, hass);
    case "binary_sensor":
      return refineBinarySensor(vm, s);
    case "person":
    case "device_tracker":
      return refinePresence(vm, s);
    case "sensor":
      return refineSensor(vm, s);
    case "weather":
      vm.icon = weatherIcon(s.state);
      vm.accent = "accent";
      vm.secondary = s.attributes.temperature != null ? `${formatNumber(s.attributes.temperature as number)}°` : undefined;
      return vm;
    case "scene":
      vm.accent = "accent";
      vm.displayState = "Scene";
      vm.quickAction = { kind: "activate", label: "Activate", call: buildSceneActivate(vm.entityId) };
      return vm;
    case "script":
      vm.active = s.state === "on";
      vm.accent = vm.active ? "accent" : "idle";
      vm.displayState = vm.active ? "Running" : "Run";
      vm.quickAction = {
        kind: "activate",
        label: "Run",
        call: buildScriptRun(vm.entityId),
        requiresConfirmation: config?.requiresConfirmation,
      };
      return vm;
    case "button":
      vm.accent = "accent";
      vm.displayState = "Press";
      vm.quickAction = {
        kind: "activate",
        label: "Press",
        call: buildButtonPress(vm.entityId),
        requiresConfirmation: config?.requiresConfirmation,
      };
      return vm;
    default:
      vm.active = on;
      vm.accent = on ? "accent" : "idle";
      return vm;
  }
}

// ---- Per-domain refinements ---------------------------------------------

function refineLight(vm: EntityViewModel, s: HassEntity, config?: WidgetConfig): EntityViewModel {
  const on = s.state === "on";
  vm.active = on;
  vm.accent = on ? "light" : "idle";
  vm.icon = config?.icon ?? s.attributes.icon ?? "mdi:lightbulb";
  const brightness = s.attributes.brightness as number | null | undefined;
  if (on && typeof brightness === "number") {
    vm.level = Math.round((brightness / 255) * 100);
    vm.secondary = `${vm.level}%`;
  } else {
    vm.secondary = on ? "On" : "Off";
  }
  const rgb = s.attributes.rgb_color as [number, number, number] | undefined;
  const mode = s.attributes.color_mode as string | undefined;
  if (on && rgb && mode && ["hs", "xy", "rgb", "rgbw", "rgbww"].includes(mode)) {
    vm.rgbCss = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
  }
  vm.quickAction = { kind: "toggle", label: on ? "Turn off" : "Turn on", call: buildToggle(vm.entityId) };
  return vm;
}

function refineClimate(vm: EntityViewModel, s: HassEntity): EntityViewModel {
  const mode = s.state;
  vm.active = mode !== "off";
  const heatish = ["heat", "heat_cool"].includes(mode);
  const coolish = mode === "cool";
  vm.accent = mode === "off" ? "idle" : heatish ? "heat" : coolish ? "cool" : "accent";
  const cur = s.attributes.current_temperature;
  const target = s.attributes.temperature;
  vm.displayState = titleCase(mode);
  const bits: string[] = [];
  if (cur != null) bits.push(`${formatNumber(cur as number)}°`);
  if (target != null && mode !== "off") bits.push(`→ ${formatNumber(target as number)}°`);
  vm.secondary = bits.join("  ");
  if (typeof target === "number") vm.level = target;
  vm.quickAction = { kind: "none", label: vm.name };
  return vm;
}

function refineCover(vm: EntityViewModel, s: HassEntity): EntityViewModel {
  const pos = s.attributes.current_position as number | undefined;
  const open = s.state === "open" || (typeof pos === "number" && pos > 0);
  vm.active = open;
  vm.accent = open ? "accent" : "idle";
  if (typeof pos === "number") {
    vm.level = pos;
    vm.secondary = `${pos}% open`;
  } else {
    vm.secondary = titleCase(s.state);
  }
  vm.quickAction = { kind: "none", label: vm.name };
  return vm;
}

function refineMedia(vm: EntityViewModel, s: HassEntity): EntityViewModel {
  const st = s.state;
  const playing = st === "playing";
  vm.active = ["playing", "paused", "on", "buffering"].includes(st);
  vm.accent = playing ? "accent" : vm.active ? "accent" : "idle";
  vm.icon = vm.active ? "mdi:cast-connected" : "mdi:cast";
  const title = s.attributes.media_title as string | undefined;
  const app = s.attributes.app_name as string | undefined;
  const source = s.attributes.source as string | undefined;
  vm.displayState = playing ? "Playing" : titleCase(st);
  vm.secondary = title ?? app ?? source ?? undefined;
  vm.quickAction = { kind: "none", label: vm.name };
  return vm;
}

function refineLock(vm: EntityViewModel, s: HassEntity, config?: WidgetConfig): EntityViewModel {
  const locked = s.state === "locked";
  vm.active = !locked; // unlocked is the state that draws attention
  vm.accent = locked ? "eco" : "warn";
  vm.icon = locked ? "mdi:lock" : "mdi:lock-open-variant";
  vm.displayState = titleCase(s.state);
  vm.quickAction = {
    kind: "toggle",
    label: locked ? "Unlock" : "Lock",
    call: locked ? buildUnlock(vm.entityId) : buildLock(vm.entityId),
    // Unlocking is sensitive; honor explicit config too.
    requiresConfirmation: locked || config?.requiresConfirmation,
  };
  return vm;
}

function refineVacuum(vm: EntityViewModel, s: HassEntity, hass?: HomeAssistant): EntityViewModel {
  const st = s.state;
  const cleaning = st === "cleaning";
  const error = st === "error";
  const co = vacuumCompanions(hass, vm.entityId);
  vm.active = cleaning;
  vm.accent = error ? "alert" : cleaning ? "accent" : "idle";

  // Prefer the richer companion status ("charging" / "drying") over the bare
  // vacuum state ("docked"), and name the room while cleaning.
  const statusText = titleCase((co.status ?? st).replace(/_/g, " "));
  vm.displayState = cleaning && co.room ? `Cleaning ${co.room}` : statusText;
  if (typeof co.progress === "number" && cleaning) vm.level = co.progress;

  // Battery lives on a sibling sensor for most robots; fall back to the (rare)
  // battery_level attribute if present.
  const batt = co.battery ?? (s.attributes.battery_level as number | undefined);
  if (cleaning && typeof co.progress === "number") {
    const area = typeof co.area === "number" && co.area > 0 ? ` · ${formatNumber(co.area)} m²` : "";
    vm.secondary = `${Math.round(co.progress)}%${area}`;
  } else {
    vm.secondary = batt != null ? `${Math.round(batt)}% battery` : undefined;
  }

  vm.quickAction =
    st === "docked" || st === "idle"
      ? { kind: "toggle", label: "Start", call: buildVacuumStart(vm.entityId) }
      : { kind: "toggle", label: "Return to dock", call: buildVacuumReturn(vm.entityId) };
  return vm;
}

const ALERT_BINARY_CLASSES = new Set(["smoke", "gas", "moisture", "problem", "safety", "carbon_monoxide", "tamper"]);

function refineBinarySensor(vm: EntityViewModel, s: HassEntity): EntityViewModel {
  const on = s.state === "on";
  vm.active = on;
  const dc = s.attributes.device_class as string | undefined;
  if (on && dc && ALERT_BINARY_CLASSES.has(dc)) vm.accent = "alert";
  else if (on) vm.accent = "accent";
  else vm.accent = "idle";
  vm.secondary = relativeTime(s.last_changed);
  return vm;
}

function refinePresence(vm: EntityViewModel, s: HassEntity): EntityViewModel {
  const home = s.state === "home";
  vm.active = home;
  vm.accent = home ? "eco" : "idle";
  vm.icon = home ? "mdi:home-account" : "mdi:home-export-outline";
  vm.displayState = home ? "Home" : titleCase(s.state);
  vm.secondary = relativeTime(s.last_changed);
  return vm;
}

function refineSensor(vm: EntityViewModel, s: HassEntity): EntityViewModel {
  const dc = s.attributes.device_class as string | undefined;
  const num = Number(s.state);
  vm.accent = "idle";
  if (dc === "battery" && !Number.isNaN(num)) {
    const charging = (s.attributes.battery_charging as boolean) ?? false;
    vm.icon = batteryIcon(num, charging);
    vm.accent = num <= 15 ? "warn" : "eco";
  }
  vm.secondary = undefined;
  vm.quickAction = { kind: "none", label: vm.name };
  return vm;
}

function placeholderModel(entityId: string, name: string, icon: string, secondary: string): EntityViewModel {
  return {
    entityId,
    domain: entityId ? domainOf(entityId) : "",
    exists: false,
    available: false,
    unknown: false,
    isPlaceholder: true,
    name,
    icon,
    rawState: "placeholder",
    displayState: "Set up",
    secondary,
    active: false,
    accent: "unavailable",
    quickAction: { kind: "none", label: "Configure" },
  };
}

/** Map an accent token to its foreground / background CSS custom properties. */
export function accentVars(accent: AccentToken): { fg: string; bg: string } {
  switch (accent) {
    case "light":
      return { fg: "var(--state-light)", bg: "var(--state-light-soft)" };
    case "heat":
      return { fg: "var(--state-heat)", bg: "var(--state-heat-soft)" };
    case "cool":
      return { fg: "var(--state-cool)", bg: "var(--state-cool-soft)" };
    case "eco":
      return { fg: "var(--state-eco)", bg: "var(--state-eco-soft)" };
    case "warn":
      return { fg: "var(--state-warn)", bg: "var(--state-warn-soft)" };
    case "alert":
      return { fg: "var(--state-alert)", bg: "var(--state-alert-soft)" };
    case "accent":
      return { fg: "var(--accent)", bg: "var(--accent-soft)" };
    case "unavailable":
      return { fg: "var(--unavailable-fg)", bg: "var(--idle-bg)" };
    case "idle":
    default:
      return { fg: "var(--idle-fg)", bg: "var(--idle-bg)" };
  }
}
