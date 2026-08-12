# Access model

## 1. Home Assistant MCP

Use for semantic interaction with the home.

The official Home Assistant MCP integration exposes tools from the selected LLM
API. The built-in Assist API is intentionally about Assist-visible Home
Assistant functionality, not the complete administration surface.

MCP is complementary to the other access methods.

## 2. REST API

`./bin/ha` authenticates using a Home Assistant long-lived access token stored in
macOS Keychain.

REST is used for:

- `/api/`
- `/api/config`
- `/api/components`
- `/api/states`
- `/api/services`
- `/api/error_log`
- `/api/config/core/check_config`
- service/action calls

## 3. WebSocket API

The helper authenticates to:

```text
/api/websocket
```

Built-in presets use:

```text
config_entries/get
config/entity_registry/list_for_display
homeassistant/expose_entity/list
```

There is also a raw command:

```bash
./bin/ha ws '{"type":"..."}'
```

Raw WebSocket is deliberately permission-gated because many Home Assistant
frontend/admin operations are WebSocket commands.

## 4. SSH app

SSH connects to the official Home Assistant Terminal & SSH app.

Normal workspace access is to the app container, including:

```text
/config
```

and the `ha` CLI.

This is not HAOS host-root SSH.

## 5. Supervisor CLI

Examples:

```bash
./bin/ha core-info
./bin/ha supervisor-info
./bin/ha apps
./bin/ha backups
./bin/ha ssh-cli network info --raw-json
./bin/ha ssh-cli hardware info --raw-json
```

The current CLI calls add-ons "apps".

## 6. Internal storage

The storage layer is intentionally read-through rather than synced.

```bash
./bin/ha storage-list
./bin/ha storage-read core.config_entries
```

Redaction is heuristic. Treat output as potentially sensitive even after
redaction.

Raw access:

```bash
./bin/ha storage-read-raw core.config_entries
```

should be rare.

## 7. UniFi Network Controller

The UniFi Network Controller (Dream Machine) is a separate system from Home
Assistant. `./bin/unifi` authenticates using a Network Application API key
generated from the **main admin account**, stored in macOS Keychain
(`claude-unifi-api-token`, distinct from the HA token). The key therefore
carries full read/write permission at the credential level — safety comes
from command scoping and permission gating, not from the key itself being
restricted. See `docs/SECURITY.md`.

It talks only to the official, documented UniFi Network Integration API v1
(`https://<console>/proxy/network/integration/v1/...`). Endpoint coverage
below is verified against this console's own bundled docs (Settings →
Integrations, v10.5.67) — not just public/third-party sources.

Read (pre-approved, `.claude/settings.json` `allow` tier):

```bash
./bin/unifi sites
./bin/unifi devices
./bin/unifi device <id>
./bin/unifi clients
./bin/unifi client <id>
./bin/unifi networks                # VLANs
./bin/unifi network <id>
./bin/unifi wifi-broadcasts          # WiFi networks / SSIDs
./bin/unifi wifi-broadcast <id>
./bin/unifi firewall-zones
./bin/unifi firewall-zone <id>
./bin/unifi firewall-policies
./bin/unifi firewall-policy <id>
./bin/unifi acl-rules
```

Write (every call requires explicit approval — `.claude/settings.json` `ask`
tier, never `allow`):

```bash
./bin/unifi client-authorize-guest <id> [timeLimitMinutes] [dataUsageLimitMBytes] [rxRateLimitKbps] [txRateLimitKbps]
./bin/unifi client-unauthorize-guest <id>
./bin/unifi device-restart <id>
./bin/unifi raw <METHOD> <path> [json-body]
```

`AUTHORIZE_GUEST_ACCESS`/`UNAUTHORIZE_GUEST_ACCESS` are the *only* client
actions v1 exposes — there is no block/unblock/forget/reconnect endpoint,
despite that being a reasonable guess; it was checked against the console's
own docs and doesn't exist. Don't add it back without re-verifying.

`raw` is the escape hatch for anything not covered by a named command —
notably create/update/delete for networks (VLANs), WiFi broadcasts,
firewall zones/policies, and ACL rules. Those endpoints exist in v1 and take
multi-field request bodies (e.g. a network's `management`/`vlanId`/
`dhcpGuarding`, a WiFi broadcast's `securityConfiguration`/
`radiusConfiguration`/`multicastFilteringPolicy`) not worth hand-wrapping
into narrow commands — review the exact body against the console's docs
before approving a `raw` call that changes network design. `raw DELETE` and
factory-reset/restore-shaped action bodies are blocked outright by the
`ha_guard.py` PreToolUse hook regardless of permission tier.

The console's TLS certificate is pinned by fingerprint at setup time
(`./bin/bootstrap-unifi`) rather than trusted via a blanket
`rejectUnauthorized: false`; see `docs/SECURITY.md`.
