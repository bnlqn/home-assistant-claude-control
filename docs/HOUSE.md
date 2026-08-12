# House

What's actually in this Home Assistant instance, kept short enough to stay
current. For control-plane/tooling docs, see `docs/ACCESS-MODEL.md`,
`docs/OPERATIONS.md`, `docs/SECURITY.md`, and `docs/HACS.md`.

## Areas

Registered in `core.area_registry`:

- Living Room
- Kitchen
- Bedroom
- Mia's bedroom
- Julien's bedroom
- Office (Ben's office)
- Playground
- Hallway
- Corridor
- Other

## Automations (`config/automation/`)

One file per automation, grouped by room (`!include_dir_merge_list
automation` in `configuration.yaml`). Currently all 17 automations are
Hue physical-remote bindings: button presses trigger scene activation,
light toggle, or all-off for that room's lights. `bens_office` also has a
low-battery notification for its remote.

Room folders: `bedroom/`, `bens_office/`, `juliens_bedroom/`,
`living_room/`, `mias_bedroom/`, `playground/`.

## Scripts (`config/scripts.yaml`)

- `goodnight` — turns off `light.all_lights`, then activates each room's
  nightlight scene.

## Packages (`config/packages/`)

- `home_dashboard.yaml` — dashboard-support template helpers (e.g. a
  synthetic "Home Attention" binary sensor that drives dashboard header
  color/messaging based on vacuum errors and inverter connectivity).
- `energy_history.yaml` — hourly/daily/weekly/monthly utility-meter
  breakdown of `sensor.p1_meter_energy_import`, plus rolling 30-day
  hour-of-day averages used to forecast the rest of the day's usage. Note:
  grid import only, doesn't count self-consumed solar.
- `tesla_solar_charging.yaml` — solar-only EV charging: dynamically matches
  charge current to solar export surplus (`sensor.p1_meter_power`) via the
  `tesla_fleet` integration, gated by `input_boolean.tesla_solar_charging_active`.

## Themes (`config/themes/`)

- `kohbo.yaml` — primary theme (paired with `config/www/kohbo/kohbo_icons.js`
  custom icon pack).
- `lurkinski.yaml`

## Dashboards

`lovelace.dashboard_test` is the live storage-mode dashboard. In-progress
edits to its room views live at `config/dashboards/dashboard_test/` — see
that directory's README before applying anything from it. Use the
`ha-dashboard` skill for dashboard work.

## UniFi Network

UI-managed config entry (`unifi`, title "Default") — no YAML. Exposes
firewall-rule switches (e.g. `switch.unifi_network_allow_trusted_to_iot`)
and firmware `update.*` entities for network gear (Dream Machine, U6 Pro,
U6 Mesh, chambre AP, two PoE switches), plus device trackers for clients.

For direct visibility into and action on the controller itself (client/
device inspection beyond what the HA integration exposes; write actions
like blocking a client or restarting a device), use `./bin/unifi` — see
`docs/ACCESS-MODEL.md` §7. Setup: `./bin/bootstrap-unifi`. Write commands
always prompt for approval.

## HACS-managed integrations & frontend cards

See `docs/HACS.md` — not tracked in Git, reinstall via HACS.

## Waste collection (`configuration.yaml`)

`waste_collection_schedule` integration configured for a `recycleapp_be`
source (Belgium), with per-fraction sensors (PMC, Paper, Residual waste,
Organic waste) plus a catch-all "Next collection" sensor.
