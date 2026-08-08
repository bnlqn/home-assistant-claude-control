---
name: home-assistant
description: Inspect, understand, configure and troubleshoot the connected production Home Assistant installation using MCP, REST/WebSocket, SSH /config and Supervisor CLI.
allowed-tools: Bash(./bin/ha status) Bash(./bin/ha states *) Bash(./bin/ha services) Bash(./bin/ha components) Bash(./bin/ha config-runtime) Bash(./bin/ha config-entries *) Bash(./bin/ha entity-registry) Bash(./bin/ha exposed-entities) Bash(./bin/ha inventory) Bash(./bin/ha logs *) Bash(./bin/ha storage-list) Bash(./bin/ha storage-read *) Bash(./bin/ha remote-file *) Bash(./bin/ha diff) Bash(./bin/ha validate)
---

# Home Assistant

Use this skill whenever the task concerns the connected Home Assistant installation.

## Principle

Home Assistant MCP is useful but incomplete. Do not use MCP availability as a
proxy for what exists in Home Assistant.

Use the appropriate interface:

| Need | Preferred interface |
|---|---|
| Natural semantic home state/action | HA MCP |
| Runtime state/services/config | REST/WebSocket |
| Config entries / UI internals exposed by API | WebSocket/REST |
| YAML/custom components/themes/www | SSH-backed `config/` |
| Core/apps/backups/Supervisor | `ha` CLI over SSH |
| Internal persistence diagnosis | redacted `.storage` read |

## Start narrow

Do not dump the entire installation unless broad architecture analysis was asked.

Examples:

```bash
./bin/ha states light.kitchen
./bin/ha config-entries hue
./bin/ha storage-read lovelace
```

For broad architecture:

```bash
./bin/ha inventory
```

## Configuration workflow

1. Inspect live data.
2. Inspect relevant tracked config.
3. Determine YAML-managed vs UI-managed.
4. Make local changes in `config/`.
5. Run `./bin/ha diff`.
6. Run `./bin/ha validate`.
7. Do not deploy unless deployment is part of the user's requested action.

For production deployment use `/ha-deploy`.
