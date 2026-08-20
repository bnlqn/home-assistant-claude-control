# Repository Guidelines

## Project Structure & Module Organization

Home Assistant configuration lives in `config/`: room-grouped automations under `config/automation/`, integrations under `config/packages/`, dashboards under `config/dashboards/`, and themes/assets under `config/themes/` and `config/www/`. The Lit/TypeScript dashboard lives in `panel/`; source is in `panel/src/`, tests are colocated as `*.test.ts`, and Vite emits `config/www/home-dashboard/home-dashboard-panel.js`. CLI wrappers live in `bin/`, implementations in `tools/`, and operational guidance in `docs/`. Read `CLAUDE.md` before changing live-facing behavior.

## Build, Test, and Development Commands

- `cd panel && npm ci`: install the locked dashboard dependencies.
- `cd panel && npm run dev`: run Vite with the mock Home Assistant harness.
- `cd panel && npm run typecheck`: run strict TypeScript checks.
- `cd panel && npm test`: run the Vitest suite once.
- `cd panel && npm run build`: type-check and create the production panel bundle.
- `./bin/ha diff`: compare the tracked mirror with the live installation.
- `./bin/ha validate`: validate Home Assistant configuration before deployment.
- `./bin/ha panel-build`: build the panel through the supported workflow.

Do not deploy or restart Home Assistant as part of routine verification; production changes require the explicit deployment workflow described in `CLAUDE.md`.

## Coding Style & Naming Conventions

Use two-space indentation in TypeScript and YAML. Keep imports explicit; use `camelCase` for functions/variables, `PascalCase` for classes/types, and kebab-case custom-element tags such as `hd-widget-light`. Name automation files descriptively in `snake_case.yaml`, group them by room, and keep automation IDs stable and unique. Follow existing Lit patterns and do not hand-edit generated bundles. No repository-wide formatter is configured, so match nearby code.

## Testing Guidelines

Vitest runs in `jsdom` and discovers `panel/src/**/*.test.ts`. Add focused tests beside changed modules, especially for configuration validation, service calls, layout, state formatting, and entity adapters. There is no fixed coverage threshold. Run `npm test`, `npm run typecheck`, and, for YAML changes, `./bin/ha validate`.

## Commit & Pull Request Guidelines

History uses Conventional Commit prefixes such as `feat:`, `fix:`, `docs:`, and `chore:`. Keep commits scoped and imperative. Pull requests should explain user-visible behavior, list validation performed, link relevant issues, and include screenshots for panel UI changes. Call out any restart, cache-stamp, or migration requirement.

## Security & Production Safety

Never commit tokens, `secrets.yaml`, `.storage`, databases, logs, backups, or machine-local files. Inspect live state before assuming entity IDs are current. Keep changes minimal, review `./bin/ha diff`, and never edit Home Assistant `.storage` directly.
