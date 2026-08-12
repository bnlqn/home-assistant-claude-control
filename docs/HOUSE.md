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

### VLAN segmentation

Four networks/zones: Default (VLAN 1), Home Network (VLAN 20, zone
"Secure Zone"), IOT Network (VLAN 30, zone "Unsecure Zone"), Automation
Network (VLAN 40, zone "Automation Zone", `192.168.40.0/24`) — HA itself
lives here at `192.168.40.10`. Inter-zone traffic is default-deny; each
allowed path is an explicit firewall policy plus its auto-generated
return-traffic rule.

As of 2026-08-12, Home → Automation is allowed only for DNS/HA-UI/SSH
(ports 53, 22, 8123 — policy "Allow Home to Automation (DNS + HA UI +
SSH)"). The reverse direction (HA-initiated traffic into Home) has no
default allowance, which broke the HA backup CIFS mount to the NAS
(UNAS-2, `192.168.20.253`, share `homeassistant_backups`) after HA moved
onto the Automation VLAN — HA's outbound connections to the NAS, including
plain ICMP, hit the Automation→Home catch-all block. Fixed by adding
policy "Allow Automation to Home (SMB backup mount)": Automation Zone →
Secure Zone, destination restricted to `192.168.20.253` TCP/445 only (not
a blanket VLAN opening). If other Automation→Home needs come up (e.g.
another NAS share, a different port), extend that policy or add a new
narrowly-scoped one rather than widening it to the whole zone/subnet.

The same catch-all block also broke the `apple_tv` (Apple TV, `192.168.20.217`)
and `songpal` (Sony HT-A9, `192.168.20.241`) integrations, both on the Secure
Zone — HA's outbound connection attempts hit Automation→Home block and the
`media_player` entities went `unavailable`. Fixed the same way, with two more
narrowly-scoped policies (Automation Zone → Secure Zone, destination IP only,
no port restriction since both protocols use multiple/dynamic ports):
"Allow Automation to Home (Apple TV control)" → `192.168.20.217` TCP+UDP, and
"Allow Automation to Home (Sony HT-A9 control)" → `192.168.20.241` TCP+UDP.

Note: general SSDP/UPnP multicast discovery (M-SEARCH to `239.255.255.250`)
still fails across the zone boundary (`async_upnp_client.ssdp` logs periodic
`Network unreachable`) — multicast doesn't traverse zones like unicast does.
This doesn't affect control of already-configured devices like the two above;
it would only matter for discovering *new* UPnP devices from HA, which would
need multicast/mDNS reflection across zones, not attempted here.

## HACS-managed integrations & frontend cards

See `docs/HACS.md` — not tracked in Git, reinstall via HACS.

## Waste collection (`configuration.yaml`)

`waste_collection_schedule` integration configured for a `recycleapp_be`
source (Belgium), with per-fraction sensors (PMC, Paper, Residual waste,
Organic waste) plus a catch-all "Next collection" sensor.
