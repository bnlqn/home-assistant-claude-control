# HACS-managed resources

`config/custom_components/*` and `config/www/community/` are installed and
updated by HACS. They are **not** tracked in Git — they're vendor code, they
total tens of MB, and every HACS update would otherwise produce a noisy diff
unrelated to actual configuration changes.

`config/www/kohbo/` is hand-authored (the `kohbo` theme's icon pack) and
**is** tracked normally.

If restoring this instance from a fresh HA install, reinstall the following
through HACS rather than expecting them to come from Git.

## `deploy --delete` risk

Because these directories are real files on disk but gitignored, the local
`config/` working copy only matches live `/config` for them if
`./bin/ha pull` has been run *after* the HACS install. If something was
installed live (via the HACS UI, or a manual drop into `www/community/`)
without a subsequent `pull`, the local mirror is stale for that path — and
`./bin/ha deploy --delete` trusts the local mirror as ground truth for what
to remove. A stale mirror plus `--delete` will silently delete live vendor
code that was never in Git and has no local backup.

**Always run `./bin/ha pull` immediately before `./bin/ha deploy --delete`**,
and treat its output/prompts as a chance to notice unexpected vendor
directories about to disappear. If a deletion does happen, HACS-tracked
repos can usually be recovered by finding their `update.<name>_update`
entity and re-triggering install from the HACS UI (⋮ menu → Redownload) —
`update.install` alone won't help if HACS doesn't think a new version is
available.

## Integrations

| Repository | Domain |
|---|---|
| hacs/integration | hacs |
| mampfes/hacs_waste_collection_schedule | waste_collection_schedule |
| basnijholt/adaptive-lighting | adaptive_lighting |
| danielkaldheim/ha_airstage | fujitsu_airstage |
| ReikanYsora/Helios-Forecast | helios_forecast |

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
| ReikanYsora/Helios |

Snapshot taken from live `hacs.repositories` storage on 2026-08-11, updated
2026-08-17 to add Helios/Helios Forecast. If this list drifts from reality,
re-check with:

```bash
./bin/ha storage-read hacs.repositories
```
