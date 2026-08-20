# Home Dashboard Panel

A purpose-built, **Homey-style** custom dashboard for Home Assistant. It is a
native [custom panel](https://developers.home-assistant.io/docs/frontend/custom-ui/creating-custom-panels/)
— **not** a Lovelace dashboard. There are no Lovelace cards, no Mushroom, no
Bubble Card, no card-mod, no HACS card dependencies, and no iframe. Everything
is a widget and every room is its own route. The panel code is one bundled ES
module, accompanied by local animation assets, built with **Lit + TypeScript +
Vite**.

It runs entirely on your local network: no external CDN, no hosted fonts, no
remote scripts, no long-lived access token. It talks to Home Assistant through
the authenticated `hass` object the frontend hands every panel.

<p align="center"><em>Soft neutral canvas · generously rounded widgets · clear
iconography · active/inactive state that reads at a glance · controls embedded
right in the widgets · a consistent detail surface for everything else.</em></p>

---

## Contents

- [Quick start](#quick-start)
- [Commands](#commands)
- [Install into Home Assistant](#install-into-home-assistant)
- [The one file you edit — configuration](#the-one-file-you-edit--configuration)
  - [Add a room](#add-a-room)
  - [Add a widget](#add-a-widget)
  - [Placeholder entities](#placeholder-entities)
- [Widget catalogue](#widget-catalogue)
- [How it looks & behaves](#how-it-looks--behaves)
- [Architecture](#architecture)
- [Build baseline and budgets](#build-baseline-and-budgets)
- [Testing](#testing)
- [Kiosk / wall tablets](#kiosk--wall-tablets)
- [Troubleshooting](#troubleshooting)

---

## Quick start

Use Node.js 20.19+, 22.13+, or 24+.

```bash
cd panel
npm ci
npm run dev        # open the local URL printed by Vite
```

`npm run dev` serves the panel with a **mock Home Assistant** (built from a real
snapshot of this home), so the whole dashboard — routing, widgets, sliders,
detail sheets, light & dark — works in the browser without a live HA. A small
"Toggle offline" button (dev only) lets you exercise the disconnected state.

## Commands

| Command             | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Vite dev server with the mock hass harness (hot reload).            |
| `npm run build`     | Type-check **and** build the production module.                     |
| `npm run build:fast`| Build without the type-check (faster iteration).                    |
| `npm run check`     | Run type-check, lint, tests, and the production build.              |
| `npm run lint`      | Run TypeScript and Lit correctness linting.                         |
| `npm test`          | Run the Vitest suite once.                                          |
| `npm run test:watch`| Vitest in watch mode.                                               |
| `npm run typecheck` | `tsc --noEmit` only.                                                |

The production build writes the bundled panel module and its local animation
assets into the Home Assistant working mirror:

```
config/www/home-dashboard/home-dashboard-panel.js
config/www/home-dashboard/assets/**/*.webp
```

The optimized 2026-08-20 baseline is 359 kB JavaScript (95 kB gzip) and
approximately 1.9 MiB / 14 files for the complete deployable directory. Energy
flows are five packed animated WebPs plus reduced-motion stills. See
[Build baseline and budgets](#build-baseline-and-budgets).

Because it lands under `config/www/`, it ships through the normal
`./bin/ha deploy` rsync flow and is served at
`/local/home-dashboard/home-dashboard-panel.js`.

## Install into Home Assistant

The registration is **already added** to `config/configuration.yaml`:

```yaml
panel_custom:
  - name: home-dashboard-panel
    sidebar_title: Home Panel
    sidebar_icon: mdi:view-dashboard-variant
    url_path: home-panel # distinct from the existing "home-dashboard" Lovelace dashboard
    module_url: /local/home-dashboard/home-dashboard-panel.js
    embed_iframe: false
    handle_safe_area: true # the panel applies its own safe-area insets
    require_admin: false
    config:
      default_view: overview
```

> `name` must equal the custom-element tag (`home-dashboard-panel`). `url_path`
> is the sidebar route — keep it **distinct** from any Lovelace dashboard key.
> The panel derives its own base route from `url_path`, so you can rename it
> freely.

To go live (a user-controlled step — nothing here deploys on its own):

```bash
./bin/ha panel-build --stamp       # build + pin ?v=<hash> on module_url
./bin/ha diff                      # review the config + bundle change
# then deploy with the /ha-deploy skill (targeted; a Core restart is only
# needed the first time panel_custom is added or when module_url changes)
```

`./bin/ha panel-build` runs the production build and prints the bundle's content
hash. With `--stamp` it also rewrites the `?v=<hash>` cache-buster on `module_url`
in `configuration.yaml`, so the wall display provably loads the new bundle —
because a changed `module_url` re-registers the panel, this needs a Core restart
(which `/ha-deploy` offers). During **development** skip `--stamp`: the bundle
content changes and a browser hard-refresh (⌘/Ctrl-Shift-R) picks it up with no
restart. After deploying the first time, **restart Core** regardless (adding
`panel_custom` requires it).

## The one file you edit — configuration

Every entity id in the whole dashboard lives in **one** strongly-typed file:

```
panel/src/config/dashboard.config.ts
```

Widgets never hard-code entities — they receive them from this config. It ships
pre-populated with **this home's real entities**, grouped by room, so it works
the moment it is deployed. To point the dashboard at a different Home Assistant,
edit that file and nothing else.

The config is **validated at startup**. Invalid widget types, unsupported sizes,
duplicate ids, missing views, and malformed entity ids produce a clear
developer-facing error banner (and a `console.error`), while the rest of the
dashboard still renders. Missing entities render an intentional "unavailable"
state — they never crash the panel or show fabricated values.

### Add a room

Add a `ViewConfig` with `type: "room"`:

```ts
{
  id: "garage",              // becomes the route: /home-panel/garage
  type: "room",
  label: "Garage",
  icon: "mdi:garage",
  widgets: [ /* … */ ],
}
```

The room automatically appears in the navigation. **A room is always a full
view/route — never a card, tile, or widget.**

### Add a widget

Add a `WidgetConfig` to a view's `widgets` array:

```ts
{
  id: "garage-door",         // must be unique across the whole dashboard
  type: "cover",
  entity: "cover.garage_door",
  name: "Garage door",        // optional label override
  icon: "mdi:garage",         // optional icon override (mdi:*)
  requiresConfirmation: true, // optional — guards the quick action
  size: { compact: "1x1", medium: "2x1", wide: "2x1" },
}
```

- **`size`** is required per breakpoint. Only sizes the widget type genuinely
  supports are allowed; an unsupported size is rejected at startup with a
  message telling you which sizes are valid.
- Breakpoints resolve against the **panel's own width**, not the screen:
  `compact ≈ phone`, `medium ≈ tablet`, `wide ≈ desktop / wall display`.
- The same widget may use different approved footprints at different
  breakpoints.
- Widget-specific options are discriminated by `type`. Light accepts no option
  bag; climate and the composite Energy family expose only their documented
  keys, so TypeScript rejects options copied from an incompatible widget.

### Placeholder entities

Any entity id containing `REPLACE_ME` renders a visible "needs configuration"
state instead of crashing — handy when scaffolding:

```ts
{ id: "x", type: "light", entity: "light.REPLACE_ME_MAIN",
  size: { compact: "1x1", medium: "1x1", wide: "1x1" } }
```

## Widget catalogue

Each type declares the footprints it can render usefully (enforced by
validation). Sizes are `WIDTH x HEIGHT` in grid units.

| Type            | Sizes                     | Direct control · detail surface                                   |
| --------------- | ------------------------- | ----------------------------------------------------------------- |
| `light`         | 1x1 · 2x1 · 1x2 · 2x2     | Toggle; brightness bar (2x1/1x2), + colour temp (2x2). Detail: power, brightness, colour temp, an HS colour wheel (lazy-loaded for colour-capable lights) + quick swatches, effects. |
| `switch`        | 1x1 · 2x1                 | Toggle. Generic detail.                                           |
| `fan`           | 1x1 · 2x1 · 1x2           | Toggle; speed slider when supported.                             |
| `climate`       | 2x1 · 1x2 · 2x2           | Target-temp stepper; mode selector (2x2). Detail: mode, fan, swing, preset, plus any extra device switches listed in `options.switches` (e.g. the Airco's powerful / economy / quiet-fan / human-detection toggles). |
| `cover`         | 1x1 · 2x1 · 1x2 · 2x2     | Open/stop/close; position slider when supported. Tilt in detail.|
| `media`         | 2x1 · 2x2                 | Transport; rich artwork tile (2x2). Detail: volume, mute, sound mode, source. |
| `sensor`        | 1x1 · 2x1 · 1x2 · 2x2     | Value hero; lazy 24 h trend (2x2). Detail: metadata + history.   |
| `binary_sensor` | 1x1 · 2x1                 | Glanceable state. Detail.                                        |
| `person`        | 1x1 · 2x1                 | Home/away presence. Detail.                                      |
| `lock`          | 1x1 · 2x1                 | Lock/unlock (**unlock always confirmed**).                       |
| `vacuum`        | 1x1 · 2x1 · 2x2           | Start/pause/dock; suction (2x2).                                 |
| `camera`        | 2x1 · 2x2                 | Lazy live still, refreshed while visible.                        |
| `weather`       | 2x1 · 1x2 · 2x2           | Current conditions; forecast strip (1x2/2x2).                    |
| `energy`        | 2x1 · 1x2 · 2x2           | Composite (reads sensors from `options`); live power + trend.   |
| `powerflow`     | 2x2 · 3x3                 | Animated Grid ↔ Solar ↔ House ↔ Car flow diagram (composite; reads sensors from `options`). `3x3` is an XL footprint for tablet/desktop where the size-capped nodes gain whitespace; phones stay full-width 2x2. Detail: larger diagram + live values + 24h grid trend. |
| `solarcharging` | 2x1 · 1x2 · 2x2           | Bespoke Tesla solar-charging control (composite; reads helpers/sensors from `options`). Icon quick-toggles the solar-charging master; tile shows live charge status + battery-to-target bar. Detail: master toggle, live status grid, and the grid-power start/stop + min-current thresholds as sliders. |
| `energychart`   | 2x2 · 4x2                 | Long-range energy history (composite; reads `total_increasing` statistic ids from `options`). Grouped bars of solar / import / export / car-charging in kWh via the Statistics API, with a Day / Week / Month selector. `4x2` is a wide banner for tablet/desktop; phones use full-width 2x2. |
| `scene`         | 1x1 · 2x1 · 1x2           | Whole-tile activate.                                             |
| `script`        | 1x1 · 2x1                 | Whole-tile run (confirmable).                                    |
| `button`        | 1x1 · 2x1                 | Whole-tile press (confirmable).                                  |
| `action`        | 1x1 · 2x1                 | Entityless — calls a service from `options` (e.g. "All lights off"). |
| `alarm`         | 1x1 · 2x1 · 2x2           | Arm/disarm (disarm confirmed).                                   |

Composite widgets (`energy`, `action`) take their entities/service via
`options` instead of `entity`. See the examples in `dashboard.config.ts`.

## How it looks & behaves

- **Two interaction targets, never ambiguous.** The widget's **icon** performs
  the quick action (toggle / activate); the **title / body** opens the detail
  surface. Controls (sliders, transport) own their own events. Sensor-style
  widgets with no direct action use their whole body to open details.
- **One detail surface for everything.** Bottom sheet on phones, right-side
  drawer on wide screens — with a drag handle, Escape-to-close, focus trapping,
  focus restoration to the widget that opened it, and live state while open.
- **Sensitive actions are confirmed** — unlocking, disarming, or anything you
  flag `requiresConfirmation`.
- **Optimistic + reconciled.** Sliders update instantly, debounce service calls
  during a drag, send a precise final value on release, and reconcile against
  live state. Failures toast and revert.
- **Responsive by container.** A deterministic square-unit CSS grid: 2 columns
  on phones up to 10 on large displays, measured from the panel's own width so
  it adapts inside a narrowed sidebar or on a wall tablet. Configured widget
  order is always preserved (no dense packing that would desync keyboard/reader
  order).
- **Light & dark**, defaulting to Home Assistant's `darkMode` (falling back to
  the OS preference), with an in-panel appearance toggle that overrides.
- **Accessible**: 44 px minimum targets, visible focus, slider/switch/dialog
  semantics, keyboard-operable navigation and controls, tabular numerals,
  `prefers-reduced-motion` respected, and state never conveyed by colour alone.
- **Offline-aware**: on disconnect it keeps the last known values, marks itself
  offline, pauses state-changing controls, and recovers automatically.

## Architecture

```
panel/src/
  panel/            home-dashboard-panel.ts (root) · app-shell · view-grid · router · layout · assets
  config/           schema · widget-options · validation · dashboard.config.ts  ← entity bindings live here
  design-system/    tokens.ts (light/dark, type, motion) · mdi-paths.ts (tree-shaken icons)
  home-assistant/   capabilities · service-calls · state-formatting · history · entity-adapters/
  primitives/       icon · icon-button · toggle · slider · segmented · misc (progress/badge/skeleton/trend)
                    · surface (sheet/drawer/dialog) · confirm-dialog · toast · feedback bus · registry
  widgets/          widget-frame · base-widget · widget-definition · widget-registry · one module per domain
  details/          detail-surface · detail-context · detail-registry · domain renderers · legacy controllers
  dev/              mock-hass.ts · main.ts (dev harness — never shipped)
  testing/          fixtures + Vitest setup
```

Key ideas:

- **Adapters normalise, components render.** Visual components never parse raw
  domain quirks — an `EntityViewModel` from `entity-adapters/` gives them name,
  icon, state, colour accent, active flag, level, and a safe quick action.
- **Capability-driven.** Brightness, colour, fan mode, tilt, source, etc. are
  only offered when the entity's `supported_features` / attributes advertise
  them (`home-assistant/capabilities.ts`).
- **One widget contract, migrated incrementally.** `widget-definition.ts`
  centralizes tag/loading, footprints, entity dependencies, section placement,
  quick-action/detail metadata, and widget-specific option validation. Light
  and climate are the first definitions; legacy widgets retain their existing
  tables until each is migrated with contract coverage.
- **Detail domains stay independent.** Every detail body implements the small
  `DetailContext` contract in a focused domain module. Light and climate are
  selected through the typed widget-definition registry; a 66-line
  `controllers.ts` router preserves fallback routing for widget domains that
  have not yet migrated their definitions.
- **Performance.** Each widget re-renders only when a **referenced** entity's
  state object changes by reference (or connectivity/size changes) — the
  frequently-changing full `hass` object doesn't re-render the whole grid.
  History, forecasts, camera stills, and trend charts load lazily and only when
  visible.
- **Icons** are bundled from `@mdi/js`, tree-shaken to just the ~170 glyphs used
  — no icon font, no CDN. Unknown icons fall back to HA's `<ha-icon>` when
  present, else a neutral dot.
- **Local-only runtime.** Lit and all executable dependencies are inlined into
  the panel module. Raster art and packed animations are same-origin files under
  `/local/home-dashboard/assets/`; nothing requires an external network.

## Build baseline and budgets

These budgets prevent quiet regressions. The current values are warning
ceilings, not performance targets to grow into.

| Resource | 2026-08-20 baseline | Warning ceiling | Direction |
| --- | ---: | ---: | --- |
| Entry module, raw | 359 kB | 390 kB | Keep raster assets external and application growth bounded. |
| Entry module, gzip | 95 kB | 105 kB | Keep framework/application growth bounded. |
| Complete deploy directory | 1.9 MiB | 2.2 MiB | Keep packed animations and static art within budget. |
| Default-route panel requests | 1 module | 4 | Keep initial rendering independent of Energy assets. |
| Active Energy animation requests | Up to 4 | 4 | Mount only the live flow layers. |
| Decoded Energy animation memory | Not yet enforced | 256 MiB target | Measure on the wall tablet before release. |

A production build prints raw and gzip module sizes. Check the complete output
with `du -sh config/www/home-dashboard` and count its files before accepting a
material asset change. CI enforcement and wall-tablet memory profiling remain
Phase 0 follow-ups in the roadmap.

## Testing

`npm test` runs 148 Vitest cases covering config validation, widget-size
validation, entity-adapter normalisation, capability detection, service-payload
construction, missing/unavailable entities, responsive size selection, routing,
the shipped config's validity, shell scroll ownership, slider keyboard semantics,
Energy flow selection and asset paths, media update lifecycle, deferred
responsive measurement, widget-definition dependencies and supported-footprint
rendering, independent domain detail routing and service payloads, the
quick-action vs. open-detail split, the
confirmation bus, and reduced-motion tokens.

`npm run check` is the local pre-commit equivalent of Panel CI. CI installs the
lockfile, runs the complete check, and verifies that the tracked deploy mirror
matches the source build. Dependabot groups panel development updates weekly
and checks GitHub Actions monthly. Home Assistant configuration validation
still requires the authenticated live-instance workflow (`./bin/ha validate`)
and is intentionally not attempted by public CI.

`schema.typecheck.ts` adds compile-time contract fixtures to that check. It
proves incompatible widget options are rejected without adding runtime code to
the production bundle.

The dev harness (`npm run dev`) is the manual visual-verification surface across
phone, tablet, laptop, and desktop widths, in light and dark.

## Kiosk / wall tablets

Off by default. Opt in per install in `dashboard.config.ts`:

```ts
kiosk: {
  enabled: true,
  hideHomeAssistantSidebar: false,  // documented; requires HA-side config, not forced here
  preventScreenSelection: true,     // disables text selection during touch control
}
```

The panel never injects invasive global CSS into the rest of Home Assistant.

## Troubleshooting

- **Panel is blank / old after an update.** Browsers cache the module. In dev,
  a hard-refresh (⌘/Ctrl-Shift-R) after a rebuild is enough. For a deploy, use
  `./bin/ha panel-build --stamp` — it pins a content-hash `?v=` on `module_url`
  so the URL provably changes (then redeploy + Core restart via `/ha-deploy`).
- **"Sidebar item didn't appear."** Adding `panel_custom` needs a **Core
  restart**, not just a YAML reload.
- **A widget shows "Not found".** The `entity` id in `dashboard.config.ts`
  doesn't match a live entity (typo, disabled entity, or integration not
  loaded). Check with `./bin/ha states <entity_id>`.
- **Config error banner at the top.** Validation found a bad widget type/size or
  a duplicate id — the banner and the browser console list exactly which
  `views[..].widgets[..]` path is wrong.
- **Route collision.** `url_path` must differ from every Lovelace dashboard key.
  This install uses `home-panel` because `home-dashboard` is the existing
  Lovelace dashboard.
- **Icons missing for a custom `icon:`.** If you use an `mdi:*` glyph that isn't
  in the bundled set, it falls back to HA's `<ha-icon>` at runtime (fine inside
  HA). To bundle it, add the name to the generator list and rebuild the icon
  map.
```
