---
name: ha-deploy
description: Safely deploy the reviewed local Home Assistant configuration to the live server with backup, validation and post-deploy verification.
disable-model-invocation: true
allowed-tools: Bash(./bin/ha diff) Bash(./bin/ha validate) Bash(./bin/ha backup *) Bash(./bin/ha deploy) Bash(./bin/ha status) Bash(./bin/ha logs *) Bash(git status *) Bash(git diff *)
---

# Deploy Home Assistant configuration

This is a production mutation workflow.

## Before deployment

Run:

```bash
git status --short
git diff
./bin/ha diff
./bin/ha validate
```

If validation fails, stop and fix it.

Explain the material changes about to be applied.

## Backup

Create a named backup:

```bash
./bin/ha backup "Claude pre-deploy"
```

If backup creation fails, do not continue silently.

## Deploy

Run:

```bash
./bin/ha deploy
```

Default deploy does NOT use rsync `--delete`.

After deployment run:

```bash
./bin/ha validate
```

## Reload versus restart

If only ordinary YAML automation/script/scene content changed, prefer the
corresponding reload command.

Do not restart Core automatically if a targeted reload is sufficient.

If a restart is genuinely required, explain why and use:

```bash
./bin/ha restart
```

## Verify

After the reload/restart:

```bash
./bin/ha status
./bin/ha logs 150
```

Verify relevant entities/automations as appropriate.

Do not claim success based solely on a zero exit code from rsync.
