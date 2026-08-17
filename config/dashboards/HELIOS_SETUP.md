# Helios energy card — remaining manual step

The Kohbo dashboard's Energy view (`home-dashboard.yaml`, path `energy`)
now uses `type: custom:helios-card` in place of the old grid/solar/house
stat bars and 24h chart. Same situation as the Homio cards in
`HOMIO_SETUP.md`: this is third-party JS Claude Code can't fetch or
install for you.

## 1. Install via HACS

Search HACS for **Helios** and install it
(https://helios-ha.org/helios/). If it isn't in the default HACS store
yet, add `https://github.com/ReikanYsora/Helios` as a custom repository
first.

Manual fallback: download `helios.js` from the latest GitHub release and
place it at `config/www/community/helios/helios.js`.

## 2. Register the Lovelace resource

Resources aren't managed via `configuration.yaml` here (same note as
`HOMIO_SETUP.md`), so add it via **Settings → Dashboards → ⋮ →
Resources**:

| URL | Type |
|---|---|
| `/local/community/helios/helios.js` | JavaScript Module |

## 3. Nothing else to configure

Helios reads entirely from the existing HA Energy dashboard (Settings →
Dashboards → Energy), already configured with the P1 meter as the grid
source and the GoodWe inverter as the solar source (no battery source).
No entity IDs are needed in the card config itself — the `energy` view's
`custom:helios-card` block has no options set.

## 4. Optional: Helios Forecast (solar production forecasting)

Companion integration, not a card — computes hourly/7-day solar
generation predictions locally and feeds them into the Energy dashboard's
solar forecast slot (currently unset: `config_entry_solar_forecast: null`
on the GoodWe source). Same install constraint as above: it's a
`custom_components` Python integration, so it has to go through HACS
yourself.

**Install:** HACS → search **Helios Forecast** → download → restart Core.
If not in the default store: add
`https://github.com/ReikanYsora/Helios-Forecast` as a custom repository.

**Add the integration:** Settings → Devices & Services → Add Integration
→ **Helios Forecast**. This system has a single roof orientation (PV1
alone ramps to ~4.3kW at midday; PV2 never reports — it's an unused
second MPPT input, not a second orientation), so one line is enough:

| Field | Value |
|---|---|
| PV production sensor | `sensor.goodwe_total_pv_generation` (cumulative kWh — not `goodwe_pv_power`, which is instantaneous W) |
| Azimuth | `246` (confirmed against the integration's own convention: degrees from north, clockwise — 180=south, 270=west — same convention as a phone compass, so the reading translates directly) |
| Tilt | `32` |
| Peak power | `4.3` kWp |

**Link it to the Energy dashboard:** Settings → Dashboards → Energy →
edit the solar source → set forecast provider to Helios Forecast's new
config entry. Helios (the card) will then show forecast data on the sun
timeline automatically — no card config change needed.

Forecasts calibrate against a rolling 60-day production history, so
expect rough predictions for the first couple of months.
