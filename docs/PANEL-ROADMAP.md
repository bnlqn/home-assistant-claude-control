# Home Dashboard Panel Roadmap

## North star

Build a device-independent Home Assistant dashboard made from reusable widgets.
Each widget owns its presentation, behavior, Home Assistant dependencies, and
supported sizes. A dashboard owns only widget instances, placement, and page
composition.

The same dashboard should feel intentional on a phone, tablet, desktop, and
wall display. Layouts may differ by display profile without duplicating widget
configuration. The Energy page keeps its house diagram as a page-level hero;
everything below that hero uses the same widget collection and layout system as
every other page.

## Decisions

- Keep Lit, TypeScript, and Vite. Lit maps directly to Home Assistant's custom
  element panel contract and to the desired independently reusable widgets.
- Refactor the domain and layout architecture before adding a dashboard editor.
  An editor built on the current section-specific layout rules would encode the
  wrong model and create migration work.
- Separate widget definition, widget instance, and widget placement. A widget's
  supported footprints are part of the widget definition; the chosen footprint
  and position are dashboard data.
- Use container width as the primary layout input, expressed through explicit
  display profiles. Orientation is useful only when it changes the available
  shape; widget code should not contain device-name checks.
- Keep the Energy hero outside the widget grid. Give the Energy page a separate
  time-range context so the hero and historical energy widgets can share a
  selected day, week, or month.
- Treat the dashboard document as versioned data from the start. Every persisted
  schema change must have a migration.

## Target architecture

### 1. Widget definition

A single registry entry should describe everything the platform needs to know
about a widget type:

- custom-element tag and lazy module loader;
- typed options and validation;
- supported footprints and default footprint per display profile;
- Home Assistant entity/statistic dependencies;
- default section/category, title, icon, and editor metadata;
- whether the widget has quick actions, details, or historical data.

This replaces the metadata currently spread across the schema, validation,
widget registry, layout classification, and detail controller switch.

### 2. Widget instance

A widget instance is stable dashboard data: `id`, `type`, entity bindings,
widget-specific options, and optional appearance overrides. It does not contain
grid coordinates and should remain valid when moved between dashboards.

### 3. Placement

Placement is stored separately by page and display profile. A placement contains
the widget id, order, footprint, optional explicit grid position, and visibility.
Initially, layouts can be ordered and auto-packed. Explicit coordinates are only
needed when the editor supports free arrangement.

Suggested initial display profiles:

| Profile | Typical shape | Purpose |
| --- | --- | --- |
| `phonePortrait` | narrow and tall | Two-up glanceable tiles; large widgets span the row |
| `phoneLandscape` | wide and short | More columns, compact navigation, low vertical chrome |
| `tabletPortrait` | medium and tall | Balanced grid with room for medium widgets |
| `tabletLandscape` | wide | More columns than portrait; navigation must not consume the gain |
| `desktop` | wide and tall | Dense grid with a bounded content width |
| `wall` | large, persistent | Optional high-density/kiosk profile |

The profile resolver should use the panel's available width and aspect ratio,
not user-agent strings. A user may override the automatically selected profile
for a particular wall display later.

### 4. Page composition

A page is a small set of explicit regions:

1. page chrome/navigation;
2. optional page-level hero;
3. one widget collection using the shared grid engine;
4. global overlays such as detail, confirmation, and toast surfaces.

Section headings may be full-width grid items, but sections must not silently
replace widget footprints or create incompatible nested sizing rules.

### 5. Home Assistant boundary

Keep entity normalization, service calls, history, and statistics behind a
small Home Assistant adapter layer. Widgets declare dependencies and consume
normalized data. Reusable Lit reactive controllers should own subscriptions,
async task state, resize/profile resolution, and cleanup.

The recorder statistics WebSocket endpoints used by the Energy features are not
documented as stable public APIs. Keep them behind one adapter with compatibility
tests and graceful fallback behavior.

## Delivery phases

### Phase 0 — Correctness and guardrails

Goal: remove current layout and maintenance hazards before structural work.

- Fix narrow-phone layouts; do not render three device columns when cells fall
  below their usable minimum width.
- Make every interactive target at least 44 by 44 CSS pixels, including title
  buttons and branded-widget controls.
- Align configuration validation with its contract: invalid widgets are either
  removed from the sanitized result or explicitly rendered as invalid, never
  both retained and described as dropped.
- Fix view-change scroll restoration at the component boundary that actually
  owns the scroll container.
- Add `handle_safe_area: true` to the Home Assistant panel registration if the
  panel continues to manage safe-area insets itself.
- Replace stale README claims about bundle size and the "single file" artifact.
- Establish budgets for the entry module, total static assets, initial requests,
  and animation memory.
- Move embedded raster data URLs to deployable assets unless a measured reason
  justifies inlining them.
- Upgrade Vite 6 to Vite 8 and Vitest 2 to Vitest 4 in isolated changes, with the
  build and test suite green after each migration.
- Add linting, dependency update automation, and a repeatable CI check for test,
  typecheck, build, and configuration validation.

Exit criteria:

- no clipped widget content at 320 px width;
- no target smaller than 44 by 44 px in the supported viewport matrix;
- production build size is measured and documented;
- all automated checks run from one CI workflow.

Progress — 2026-08-20:

- completed narrow-phone device reflow, shared/branded 44 px controls, scroll
  ownership, explicit Home Assistant safe-area ownership, and strict sanitized
  configuration results;
- added unit regressions for responsive columns, validation sanitization,
  shared control sizing, and shell scroll reset;
- verified 320×568 and 390×844 in a real browser, including internal card
  overflow and rendered control dimensions;
- extracted the Energy house, Tesla, and Roborock raster data URLs into local
  deployable assets;
- replaced Energy's four 113-frame preload trees and canvas loop with at most
  four keyed animated WebP layers, dedicated import/export direction, and
  reduced-motion stills; the source-to-packed conversion is reproducible;
- upgraded Vite 6 to Vite 8 and Vitest 2 to Vitest 4, migrating the single-file
  build configuration from deprecated Rollup options to native Rolldown options;
- reduced the production entry module from 505 kB raw / 204 kB gzip to 352 kB
  raw / 93 kB gzip, the deploy directory from 3.2 MiB / 453 files to 1.9 MiB /
  14 files, and active Energy requests from as many as 452 to at most four;
- verified the optimized Energy page at 320 and 390 px with no horizontal
  overflow, no missing flow assets, and no canvas animation path;
- added TypeScript/Lit correctness linting, a single local check command, Panel
  CI with deploy-mirror verification, and grouped Dependabot updates; live Home
  Assistant configuration validation remains an authenticated deployment gate;
- moved media artwork derivation before rendering and deferred marquee
  measurement outside Lit's completed-update lifecycle, eliminating the
  browser's extra-update warning with a component regression test;
- introduced a reusable element-width reactive controller for the shell, page
  grid, and section grids; frame-deferred delivery eliminates the development
  ResizeObserver loop while preserving 320/390 px reflow without overflow;
- still to do in Phase 0: automate browser screenshots/accessibility checks and
  profile wall-tablet decoded image memory.

### Phase 1 — Unified widget contract

Goal: make a widget a genuinely reusable unit before changing dashboard layout.

- Introduce a typed `WidgetDefinition` registry.
- Replace loose `Record<string, unknown>` option casts with a discriminated
  widget configuration union.
- Move supported sizes, entity requirements, section metadata, dependency
  discovery, and detail rendering registration into widget definitions.
- Split the large detail controller by domain/widget and register detail bodies
  alongside widget definitions.
- Extract reusable Lit controllers for Home Assistant dependencies, async data,
  and responsive profile resolution.
- Add contract tests that instantiate every registered widget at every supported
  footprint with available, unavailable, unknown, and disconnected data.

Exit criteria:

- adding a widget type requires one definition and its implementation, without
  editing parallel switch statements or metadata tables;
- TypeScript rejects an option belonging to another widget type;
- every definition is covered by registry and footprint contract tests.

Progress — 2026-08-20:

- introduced the pure, typed `WidgetDefinition` contract and migrated `light`
  and `climate` as the representative first slice;
- moved their tags/loaders, supported/default sizes, entity requirements,
  dependency discovery, section metadata, quick-action/detail metadata, and
  climate companion-switch validation behind the definitions;
- routed widget lookup, configuration validation, section classification, and
  configured detail selection through the definition registry while preserving
  a legacy fallback for every unmigrated type;
- added contract coverage that loads both registered elements and renders every
  supported footprint, plus validation/dependency regressions; the suite now
  contains 137 tests;
- kept the registry metadata layer free of UI-controller imports after a cycle
  audit, with detail bodies selected by a typed controller key;
- introduced a discriminated `WidgetConfig` union for light, climate, and the
  composite Energy family (`energy`, `powerflow`, `solarcharging`,
  `energychart`, and `electricitytotal`), with dependency-free option contracts
  and compile-time rejection fixtures;
- replaced widget/detail option casts for that first group with explicit type
  narrowing, while preserving a per-type legacy branch for the unmigrated
  catalogue; the runtime suite now contains 138 tests;
- extracted a dependency-safe `DetailContext`, typed detail registry, and
  independent light/climate detail modules; registered widget details no longer
  live in the legacy controller switch, with focused renderer/service-call
  coverage bringing the runtime suite to 144 tests;
- still to do in Phase 1: migrate the remaining catalogue and its loose option
  records, split the remaining media/device/Energy detail bodies, and introduce
  the reusable HA/async/profile controllers.

### Phase 2 — Shared responsive grid engine

Goal: make the configured footprint meaningful on every page.

- Replace section-specific footprint flattening with one placement resolver.
- Keep visual grouping, but render section labels as grid structure rather than
  as independent grids with incompatible column rules.
- Define grid columns, gap, minimum unit size, and allowed footprints for every
  display profile.
- Pass resolved footprint and profile to the widget; widgets use those inputs to
  choose compact, medium, or expanded internal anatomy.
- Keep DOM order equal to reading/tab order. Do not use dense packing when it
  would reorder accessibility navigation.
- Add deterministic packing tests and browser screenshots for 320×568, 390×844,
  844×390, 768×1024, 1024×768, 1440×900, and the target wall display.

Exit criteria:

- phone portrait, phone landscape, tablet portrait, tablet landscape, desktop,
  and wall profiles produce intentionally different layouts;
- a 2×2 climate widget remains 2×2 unless the active profile's placement says
  otherwise;
- the Energy hero remains outside the grid and its lower widgets use exactly the
  same placement engine as other pages.

### Phase 3 — Versioned dashboard document

Goal: create the data foundation needed by customization without building the
editor yet.

- Introduce a versioned, serializable dashboard document.
- Separate widget instances from placements and pages.
- Add schema validation, migrations, import/export, and safe fallback to the
  last valid document.
- Convert the current TypeScript dashboard configuration through a one-time
  adapter so behavior can migrate incrementally.
- Decide persistence explicitly:
  - local storage is acceptable only for per-device drafts/preferences;
  - synchronized household layouts should eventually use a small Home Assistant
    integration with supported WebSocket commands and versioned storage;
  - never write Home Assistant `.storage` directly from the panel.

Exit criteria:

- a dashboard document round-trips without losing widget-specific options;
- older fixtures migrate automatically to the current schema;
- a corrupt document cannot blank the dashboard.

### Phase 4 — Dashboard customization

Goal: let the user organize a collection of widgets safely.

- Add an explicit edit mode with widget gallery, add/remove, reorder, resize,
  duplicate, and per-profile visibility.
- Support previewing and editing each display profile from one device.
- Provide undo/redo, cancel/apply, keyboard reordering, and accessible resize
  controls before adding pointer drag-and-drop.
- Validate placements continuously and show why a footprint is unavailable.
- Preserve stable widget ids while moving instances between pages.
- Add export/import and a reset-to-default recovery path.

Exit criteria:

- a dashboard can be rearranged independently for phone and tablet without
  duplicating widget instances;
- editing is reversible and keyboard accessible;
- failed persistence leaves the active dashboard unchanged.

### Phase 5 — Energy time travel

Goal: support current and historical Energy views without turning the house hero
into a widget.

- Add an Energy page period model: live/today, historical day, week, and month.
- Add previous/next and date selection, with clear behavior for the current
  incomplete period.
- Introduce an `EnergyRangeController` that resolves local-time boundaries,
  requests statistics, caches by range, cancels stale requests, and exposes
  loading/error/partial states.
- Recompute hero Grid, Solar, and Home totals from the selected period rather
  than daily-state sensors when viewing history.
- Decide per Energy widget whether it follows the page period or stays live, and
  label the distinction visibly.
- Handle Home Assistant timezone, daylight-saving transitions, missing buckets,
  meter resets, unit conversion, and import/export sign conventions in tests.
- Reuse the existing bar-chart/statistics work only after its API boundary and
  range semantics have been hardened.

Exit criteria:

- totals match Home Assistant's native Energy dashboard for representative days,
  weeks, and months;
- navigating history never changes live controls;
- missing recorder data produces an honest partial/unavailable state.

### Phase 6 — Hardening and release

Goal: make the dashboard dependable as an always-on home interface.

- Run component tests in a real browser in addition to jsdom unit tests.
- Add screenshot regression coverage in light and dark modes for the full
  viewport matrix.
- Add automated accessibility checks plus manual keyboard and screen-reader
  passes for navigation, widgets, dialogs, and edit mode.
- Test reconnects, stale Home Assistant state, unavailable entities, slow
  statistics, reduced motion, and long-running kiosk use.
- Profile update frequency, animation CPU/GPU use, decoded image memory, and
  first-load requests on the wall tablet.
- Document the widget authoring contract and dashboard schema migrations.

## Work deliberately deferred

- No framework rewrite.
- No drag-and-drop editor before the widget/placement split.
- No direct writes to Home Assistant `.storage`.
- No device-specific CSS based on phone or tablet model names.
- No attempt to force the Energy house diagram into the reusable widget model.

## Recommended next slice

Complete the Phase 1 contract before changing placement semantics:

1. expand the discriminated option union and definitions through the remaining
   device, media, sensor, and action widget families;
2. split `details/controllers.ts` into domain modules and move registered detail
   ownership beside each widget definition;
3. migrate the remaining catalogue in small domain groups with footprint and
   dependency contract tests;
4. then begin the Phase 2 shared-grid slice, verifying the full viewport matrix
   before removing the legacy section grids.

This keeps the architecture boundary testable while avoiding a simultaneous
config, detail, and layout rewrite.
