# Operations runbook

## Baseline sync

```bash
./bin/ha pull
git add config
git commit -m "Sync Home Assistant baseline"
```

`pull` refuses to overwrite a dirty `config/` Git working tree.

## Inspect production drift

```bash
./bin/ha diff
```

This uses rsync itemized dry-run output.

## Validate

```bash
./bin/ha validate
```

Validation includes:

1. remote diff
2. Home Assistant REST config check where available
3. `ha core check` through the SSH app

## Deploy

Preferred interactive workflow:

```text
/ha-deploy
```

The underlying command is:

```bash
./bin/ha deploy
```

Default deploy updates/creates files but does not delete remote files.

Deletion mode exists:

```bash
./bin/ha deploy --delete
```

Use it only when you have inspected the exact rsync diff and genuinely intend
remote deletions.

## Reload

```bash
./bin/ha reload-automations
./bin/ha reload-scripts
./bin/ha reload-scenes
```

Prefer reload to restart whenever Home Assistant supports it.

## Restart

```bash
./bin/ha restart
```

A restart is not a validation mechanism. Validate first.

## Backup

```bash
./bin/ha backup "Before dashboard rewrite"
```

Backups are created through the Home Assistant CLI/Supervisor.

## Logs

```bash
./bin/ha logs 300
./bin/ha error-log
```

`logs` reads Core logs via the Supervisor-backed CLI.

## Config-entry inspection

```bash
./bin/ha config-entries
./bin/ha config-entries hue
```

This queries the live Home Assistant config-entry API over WebSocket, which is
preferable to parsing `core.config_entries` for ordinary inspection.

## Raw WebSocket

```bash
./bin/ha ws '{"type":"get_panels"}'
```

This is powerful. Use supported/documented commands when possible.

## Escape-hatch CLI

```bash
./bin/ha ssh-cli network info --raw-json
./bin/ha ssh-cli hardware info --raw-json
```

## Escape-hatch shell

```bash
./bin/ha ssh-shell 'ls -la /config/custom_components'
```

Use only where the dedicated helper commands are insufficient.
