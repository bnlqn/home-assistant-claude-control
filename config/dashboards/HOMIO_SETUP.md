# Homio dashboard — remaining manual steps

Everything YAML is scaffolded and wired to your real entities. Room
banners use a per-room color gradient for now instead of photos (see
`config/www/images/Homio/rooms/README.md` — dropping in real photos later
needs no YAML changes, they layer on top automatically). One thing is
still outstanding:

## Register the Lovelace resources — do this *after* deploying

Your `lovelace:` block doesn't set `mode: yaml`, so resources are managed
via the UI/`.storage`, not `configuration.yaml` — and the URLs below 404
until the files exist on the live instance, so this has to happen after a
deploy. Once deployed, go to **Settings → Dashboards → ⋮ → Resources** and
add:

| URL | Type |
|---|---|
| `/local/community/layout-card-modified/layout-card-modified.js` | JavaScript Module |
| `/local/community/light-slider/my-slider-v2.js` | JavaScript Module |
| `https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@100..900&display=swap` | CSS |

Say the word when you're ready to deploy and I can register these via the
frontend WebSocket API right after, instead of the UI.

## Already done

- `button-card`, `layout-card-modified.js` (119 KB, from `iamtherufus/Homio`),
  and `my-slider-v2.js` (54 KB, from `AnthonMS/my-cards`) are all in
  `config/www/community/`.
- Icons still fall back to broken images until you add SVGs — see
  `config/www/images/Homio/icons/README.md` — but nothing else depends on
  them, so this doesn't block anything.
- Theming needs no action — every view pins `theme: homio` explicitly,
  matching how `home-dashboard.yaml` pins `theme: Kohbo` per view.
