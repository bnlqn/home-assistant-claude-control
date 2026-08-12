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

## UniFi API key

The UniFi Network Integration API key is stored in macOS Keychain under:

```text
claude-unifi-api-token
```

It is generated from the **main admin account** on the controller, so the
key carries full read/write permission at the credential level — it is not
scoped down the way the HA REST token or a View-Only account would be.
Deliberate choice, made explicitly by the user; the tradeoff is that
mutation safety now depends entirely on tool/permission design rather than
the credential itself, unlike everything else in this document.

That design compensates as follows:

- Read commands (`sites`, `devices`, `clients`, `networks`, `wifi-broadcasts`,
  `firewall-zones`, `firewall-policies`, `acl-rules`, and their `<id>`
  variants) are pre-approved (`allow` tier).
- Every write command (`client-authorize-guest`, `client-unauthorize-guest`,
  `device-restart`, and the `raw` escape hatch) is in the `ask` tier only —
  never `allow` — so each call requires explicit per-invocation approval,
  matching how `./bin/ha restart`/`deploy` are treated. Client actions are
  intentionally limited to guest-access authorize/unauthorize — that's the
  only client action the v1 API exposes; there's no block/unblock/forget.
- `raw` has no endpoint allowlist (it's the fallback for VLAN/WLAN/firewall
  create/update/delete, which take complex request bodies), so `ha_guard.py`
  blocks `raw DELETE` and factory-reset/restore-shaped action bodies
  outright, regardless of the "ask" approval — the same treatment as HA
  backup restore and HAOS wipe/factory/reset.
- `./bin/unifi` has no command that can extract or print the raw API key.

`.unifi-local.json` contains no key material — only the console host, site
id, and pinned certificate fingerprint.

Local UniFi OS consoles present a certificate that isn't in a standard trust
store. `./bin/unifi` does not use a blanket `rejectUnauthorized: false`;
instead `./bin/bootstrap-unifi` captures the certificate's SHA-256
fingerprint (shown to the user for confirmation) and pins it via
`checkServerIdentity`, so a future certificate mismatch fails closed instead
of silently trusting whatever answers on that LAN IP. Re-run
`./bin/bootstrap-unifi` to re-pin after an intentional cert change (console
re-provisioned, cert renewed).

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
