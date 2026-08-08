# Security model

This workspace intentionally gives an AI agent broad operational visibility into
a real smart-home server. Treat it like privileged infrastructure automation.

## API token

The REST/WebSocket token is stored in macOS Keychain under:

```text
claude-homeassistant-api-token
```

`.ha-local.json` contains no Home Assistant token.

The helper process retrieves the token internally and does not print it.

This is **not a cryptographic sandbox against arbitrary user-approved shell
execution**. An agent allowed to run arbitrary local code as your macOS user can
ultimately access resources available to that user.

The security model therefore relies on:

- narrow pre-approved `./bin/ha` commands
- Claude Code permission rules
- a PreToolUse guard
- explicit prompting for privileged escape hatches
- not running Claude Code in bypass-permissions mode

## MCP

Prefer Home Assistant OAuth for Claude Code MCP.

Do not put a long-lived HA token into checked-in `.mcp.json`.

## SSH

Use a dedicated SSH key.

Do not reuse your personal default SSH key.

The normal target is the official Terminal & SSH app, **not HAOS host debug
SSH**.

## `.storage`

`.storage` may contain credentials.

Default reads are recursively redacted using key-name heuristics.

Heuristic redaction is not perfect. Never treat `.storage` output as guaranteed
non-sensitive.

Raw reads require an explicit manually invoked skill/permission.

## Git

Before publishing or pushing this repository, inspect:

```bash
git status
git diff --cached
git grep -n -i -E 'password|secret|token|api.?key|credential'
```

Home Assistant `secrets.yaml`, `.storage`, DBs, logs and backups are gitignored.

## Claude Code permission mode

Do not use `bypassPermissions` for this repository.

Broad inspection can be pre-approved; production mutation should remain
observable.

## HAOS root

Home Assistant OS has a separate host debugging SSH mechanism. This workspace
does not configure or use it.

If host-root recovery access is ever needed, do it in a separate recovery
session with an explicit goal.
