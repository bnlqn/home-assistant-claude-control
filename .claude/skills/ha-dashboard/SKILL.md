---
name: ha-dashboard
description: Inspect and redesign Home Assistant dashboards while preserving existing dashboard identity, integrations and unrelated views.
allowed-tools: Bash(./bin/ha status) Bash(./bin/ha states *) Bash(./bin/ha inventory) Bash(./bin/ha storage-list) Bash(./bin/ha storage-read *) Bash(./bin/ha remote-file *) Bash(./bin/ha diff) Bash(./bin/ha validate)
---

# Home Assistant dashboard work

First determine dashboard storage mode.

## YAML dashboard

If the dashboard is declared in YAML, edit the tracked source in `config/`.

## Storage/UI dashboard

Inspect the relevant Lovelace storage object with:

```bash
./bin/ha storage-list
./bin/ha storage-read lovelace
./bin/ha storage-read lovelace.<dashboard-id>
```

Names vary by installation; discover rather than assume.

Do not patch `.storage` directly as the default mechanism.

For UI-managed changes, investigate the corresponding Home Assistant API/frontend
WebSocket operation. Raw WebSocket calls are production mutations and require the
normal permission flow.

Before redesigning:

- inspect custom cards/resources
- inspect actual mobile/desktop target
- inspect entity IDs live
- preserve dashboard/view identity unless replacement is explicitly intended
- avoid removing unrelated views/cards

Validate YAML where applicable and show meaningful structural changes before
deployment.
