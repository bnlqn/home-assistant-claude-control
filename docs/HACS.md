# HACS-managed resources

`config/custom_components/*` and `config/www/community/` are installed and
updated by HACS. They are **not** tracked in Git — they're vendor code, they
total tens of MB, and every HACS update would otherwise produce a noisy diff
unrelated to actual configuration changes.

`config/www/kohbo/` is hand-authored (the `kohbo` theme's icon pack) and
**is** tracked normally.

If restoring this instance from a fresh HA install, reinstall the following
through HACS rather than expecting them to come from Git.

## Integrations

| Repository | Domain |
|---|---|
| hacs/integration | hacs |
| mampfes/hacs_waste_collection_schedule | waste_collection_schedule |
| basnijholt/adaptive-lighting | adaptive_lighting |
| danielkaldheim/ha_airstage | fujitsu_airstage |

## Frontend plugins (dashboard cards)

| Repository |
|---|
| custom-cards/button-card |
| kalkih/mini-graph-card |
| thomasloven/lovelace-state-switch |
| thomasloven/lovelace-auto-entities |
| custom-cards/decluttering-card |
| thomasloven/lovelace-card-mod |
| custom-cards/stack-in-card |
| RomRider/apexcharts-card |
| piitaya/lovelace-mushroom |
| pkissling/clock-weather-card |
| flixlix/power-flow-card-plus |
| danielkaldheim/ha_airstage (also ships the Airstage climate card) |
| Clooos/Bubble-Card |
| joseluis9595/lovelace-navbar-card |
| alexpfau/calendar-card-pro |

Snapshot taken from live `hacs.repositories` storage on 2026-08-11. If this
list drifts from reality, re-check with:

```bash
./bin/ha storage-read hacs.repositories
```
