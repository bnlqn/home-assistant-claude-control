# Room background images (optional)

Room banners currently render as a per-room color gradient — no photos
needed right now. The `homio_room` card still references
`/local/images/Homio/rooms/<image>.jpg` per room, but a missing file just
renders as transparent, so the gradient underneath shows through cleanly.

To switch a room over to a real photo later, just drop a matching `.jpg`
in here — no YAML changes required, it layers on top of the gradient
automatically:

- `home.jpg`
- `living_room.jpg`
- `bedroom.jpg`
- `bens_office.jpg`
- `juliens_bedroom.jpg`
- `mias_bedroom.jpg`
- `playground.jpg`
- `hallway.jpg`
- `corridor.jpg`

Recommended when you do: landscape, at least 1600px wide, some negative
space near the top-left where the room name renders.
