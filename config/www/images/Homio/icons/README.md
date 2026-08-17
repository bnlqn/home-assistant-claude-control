# Entity icons

19 SVGs pulled directly from `iamtherufus/Homio`'s own `homio_icons.zip`
(Google Material Symbols, 100 weight, per their README) now live in this
folder. All 6 icons the templates reference by hardcoded path are covered:

- `menu.svg`, `close.svg` — mobile nav
- `power_off.svg`, `heating.svg`, `increase.svg`, `decrease.svg` — thermostat

Variable-driven icons (`variables.icon` in `homio-dashboard.yaml`) mapped
to the closest available match:

- `power_on` — per-room main lights (9 entities)
- `lamp` — table/floor/bed/desk lamps (4 entities)
- `apple_tv` — the living room TV
- `clock` — adaptive lighting switches (6 entities, "automatic/scheduled")

## Still missing an icon (9 entities show a broken image)

No reasonable match existed in the Homio pack for these — rather than
force a wrong icon, they're left as-is until you either draw/source one
or point them at a different slug:

- `kitchen` — `light.kitchen`
- `dining` — `light.dining`
- `spotlight` — the 4 living room cylinder spots
- `vacuum` — `vacuum.roborock_s8_pro_ultra` (used on Home + Living Room)
- `person` — `person.ben`

Unused icons from the pack, available if you want to repurpose one of
these instead: `access_point`, `console`, `dehumidifier`, `door`,
`electric`, `gas`, `hot_water`, `pendent`, `plug`.
