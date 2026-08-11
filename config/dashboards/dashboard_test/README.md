# dashboard_test — Rooms views (WIP)

`room_views.json` is a **working export** of the `Rooms` section (8 room
views) from the live storage-mode dashboard `lovelace.dashboard_test`,
captured 2026-08-09.

It is **not yet applied** to the live dashboard. As of 2026-08-11 it diverges
from the live `lovelace.dashboard_test` storage object in 6 of its 8 views:

- `living-room`
- `bedroom`
- `bens-office`
- `juliens-bedroom`
- `mias-bedroom`
- `playground`

`hallway` and `corridor` currently match live.

The edits reference real, currently-existing entities (e.g.
`light.living_room_perifo_cylinder_spot_1`/`_2`), so this looks like genuine
in-progress dashboard work rather than stale scratch output.

Before applying: use the `ha-dashboard` skill to review the diff against the
live `lovelace.dashboard_test` storage object and push changes through a
supported update mechanism — do not overwrite the dashboard storage object
wholesale.
