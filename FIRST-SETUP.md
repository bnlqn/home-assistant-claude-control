# First Setup

This guide sets up Claude Code with broad, safe access to a Home Assistant OS installation.

## Architecture

```text
Claude Code
    │
    ├── stdio MCP
    │      ↓
    │   mcp-proxy
    │      ↓
    │   Home Assistant /api/mcp
    │
    ├── REST / WebSocket API
    │      ↓
    │   Home Assistant
    │
    └── SSH
           ↓
       Terminal & SSH app
           ↓
        /config + ha CLI
```

Home Assistant MCP is only one access path. Claude also uses the REST/WebSocket APIs, `/config`, and the Home Assistant CLI.

## Requirements

On the Mac running Claude Code:

- macOS
- Claude Code
- `uv`
- `ssh`
- `rsync`
- Node.js
- local network access to Home Assistant

On Home Assistant:

- Home Assistant OS
- **Model Context Protocol Server** integration
- official **Terminal & SSH** app
- `rsync` installed inside the Terminal & SSH app container
- an administrator account able to create a Long-Lived Access Token

## 1. Install the Home Assistant MCP Server integration

In Home Assistant:

```text
Settings
→ Devices & services
→ Add integration
→ Model Context Protocol Server
```

The MCP endpoint is normally:

```text
http://homeassistant.local:8123/api/mcp
```

Adjust the hostname or URL if needed.

## 2. Install Terminal & SSH

In Home Assistant:

```text
Settings
→ Apps
→ App store
→ Terminal & SSH
```

Install the official app.

Do not expose this SSH service to the public internet.

The goal is to give Claude access to `/config` and the `ha` CLI without granting unrestricted HAOS host-root access.

## 3. Run the repository bootstrap

From the repository root:

```bash
./bin/bootstrap
```

The script asks for:

- Home Assistant URL
- SSH host
- SSH port
- SSH private-key location
- Home Assistant Long-Lived Access Token

The token is stored in macOS Keychain under:

```text
claude-homeassistant-api-token
```

It is not stored in the repository.

The non-secret local configuration is stored in:

```text
.ha-local.json
```

This file is ignored by Git.

## 4. Configure Terminal & SSH

Copy the public key printed by bootstrap into the Terminal & SSH app configuration.

Also install `rsync` inside the app container. The repository uses `rsync` over SSH to synchronize `/config`, so `rsync` must exist on **both** the Mac and the Home Assistant SSH side.

Use:

```yaml
authorized_keys:
  - "ecdsa-sha2-nistp521 AAAA... claude-homeassistant"

password: ""

apks:
  - rsync

server:
  tcp_forwarding: false
```

Then configure a host SSH port in the app's **Network** section and restart the Terminal & SSH app.

First test SSH:

```bash
./bin/ha ssh-test
```

Then verify that remote `rsync` is available:

```bash
./bin/ha ssh-shell 'which rsync && rsync --version'
```

Expected output should include a path such as:

```text
/usr/bin/rsync
```

followed by the installed `rsync` version.

If you see:

```text
bash: rsync: command not found
```

check that `apks` contains `rsync`, save the Terminal & SSH configuration, and restart the app.

## 5. Verify the Home Assistant token

Check that the token exists without printing it:

```bash
ACCOUNT="$(/usr/bin/id -un)"

if /usr/bin/security find-generic-password   -a "$ACCOUNT"   -s "claude-homeassistant-api-token"   >/dev/null 2>&1
then
  echo "✓ Token exists in Keychain"
else
  echo "✘ Token not found"
fi
```

Then test Home Assistant's API:

```bash
ACCOUNT="$(/usr/bin/id -un)"

TOKEN="$(
  /usr/bin/security find-generic-password     -a "$ACCOUNT"     -s "claude-homeassistant-api-token"     -w
)"

curl -sS   -H "Authorization: Bearer $TOKEN"   http://homeassistant.local:8123/api/

unset TOKEN
```

Expected:

```json
{"message":"API running."}
```

## 6. Install `mcp-proxy`

Use a local stdio-to-HTTP proxy instead of Claude Code's direct OAuth flow.

Install:

```bash
uv tool install mcp-proxy --with "mcp<2.0.0" --force
```

### Important: keep the Python MCP SDK below 2.0

At the time this setup was created, `mcp-proxy` still imports `request_ctx` from the Python MCP SDK. MCP SDK 2.x removed that symbol, causing:

```text
ImportError: cannot import name 'request_ctx'
from 'mcp.server.lowlevel.server'
```

Claude Code surfaces that crash only as:

```text
MCP error -32000: Connection closed
```

Therefore use:

```bash
uv tool install mcp-proxy --with "mcp<2.0.0" --force
```

Verify the versions:

```bash
~/.local/share/uv/tools/mcp-proxy/bin/python - <<'PY'
import importlib.metadata as m

print("mcp-proxy:", m.version("mcp-proxy"))
print("mcp:", m.version("mcp"))
PY
```

The important part is:

```text
mcp: 1.x.x
```

not `2.x.x`.

Also verify:

```bash
mcp-proxy --help
```

## 7. Create the Home Assistant MCP proxy wrapper

Create `bin/ha-mcp-proxy`:

```bash
MCP_PROXY="$(command -v mcp-proxy)"

cat > bin/ha-mcp-proxy <<EOF
#!/bin/bash
set -eo pipefail

LOG="/tmp/ha-mcp-proxy.\$(/usr/bin/id -u).log"

{
  echo
  echo "=== HA MCP proxy starting: \$(date) ==="
  echo "Account: \$(/usr/bin/id -un)"
  echo "Proxy: $MCP_PROXY"
} >> "\$LOG"

ACCOUNT="\$(/usr/bin/id -un)"

TOKEN="\$(
  /usr/bin/security find-generic-password     -a "\$ACCOUNT"     -s "claude-homeassistant-api-token"     -w     2>>"\$LOG"
)" || {
  echo "ERROR: Could not retrieve Home Assistant token from Keychain" >> "\$LOG"
  exit 1
}

if [ -z "\$TOKEN" ]; then
  echo "ERROR: Home Assistant token is empty" >> "\$LOG"
  exit 1
fi

export API_ACCESS_TOKEN="\$TOKEN"
unset TOKEN

exec "$MCP_PROXY"   --transport=streamablehttp   --stateless   "http://homeassistant.local:8123/api/mcp"   2>>"\$LOG"
EOF

chmod 700 bin/ha-mcp-proxy
```

Change the Home Assistant URL if your instance uses something different.

The token is retrieved from Keychain at runtime and is never written into the repository.

## 8. Test the proxy manually

Clear the previous log:

```bash
rm -f "/tmp/ha-mcp-proxy.$(/usr/bin/id -u).log"
```

Run:

```bash
./bin/ha-mcp-proxy
```

If everything is working, it should remain running and appear to do nothing because it is waiting for MCP JSON-RPC messages on stdin.

Press `Ctrl+C`, then inspect:

```bash
cat "/tmp/ha-mcp-proxy.$(/usr/bin/id -u).log"
```

There should be no Python traceback.

## 9. Remove any previous OAuth-based MCP configuration

If Home Assistant was previously configured as a direct HTTP MCP server:

```bash
claude mcp remove HA
```

Do not configure OAuth, `clientId`, `callbackPort`, `clientSecret`, or `headersHelper` for this MCP entry.

The proxy handles authentication.

## 10. Add Home Assistant to Claude Code as a stdio MCP server

From the repository root:

```bash
claude mcp add   --transport stdio   HA   -- "$PWD/bin/ha-mcp-proxy"
```

Verify:

```bash
claude mcp get HA
```

Expected:

```text
HA:
  Scope: Local config (private to you in this project)
  Status: ✓ Connected
  Type: stdio
  Command: /absolute/path/to/home-assistant-claude-control/bin/ha-mcp-proxy
```

The important values are:

```text
Status: ✓ Connected
Type: stdio
```

There should be no browser authentication step.

## 11. Verify the broader Home Assistant control plane

Test:

```bash
./bin/ha status
./bin/ha config-entries
./bin/ha entity-registry
./bin/ha inventory
```

This verifies the REST API, WebSocket API, SSH, Home Assistant CLI, Supervisor access, and entity/config-entry inspection.

## 12. Pull the Home Assistant configuration

Before the first pull, verify both SSH and remote `rsync`:

```bash
./bin/ha ssh-test
./bin/ha ssh-shell 'which rsync && rsync --version'
```

Then:

```bash
./bin/ha pull
```

The sync path is:

```text
Mac rsync
    ↓ SSH
Terminal & SSH app
    ↓ remote rsync
/config
```

Because `rsync` runs at both ends, the Terminal & SSH app must have `rsync` installed through:

```yaml
apks:
  - rsync
```

If the remote side does not have it, `./bin/ha pull` typically fails with:

```text
bash: line 1: rsync: command not found
rsync: error: unexpected end of file
```

The second error is only a consequence of the remote `rsync` process failing to start.

A successful pull copies normal editable configuration from `/config` into `config/`.

Sensitive and runtime data is excluded, including:

```text
secrets.yaml
.storage/
home-assistant_v2.db
logs
backups
```

## 13. Initialize the Git baseline

If needed:

```bash
git init
git add .
git commit -m "Baseline Home Assistant configuration"
```

Claude should normally edit the local `config/` working tree rather than blindly changing production.

## 14. Start Claude Code

From the repository root:

```bash
claude
```

A useful first request:

```text
Analyze my Home Assistant installation.

Use the live Home Assistant APIs, config entries, entity registry,
Supervisor information, /config, dashboards, automations, and redacted
internal storage where needed.

Do not make changes yet.

Build an architectural overview and identify stale integrations,
orphaned entities, broken automations, configuration inconsistencies,
and opportunities to simplify the installation.
```

## Normal workflow

Inspect:

```bash
./bin/ha status
./bin/ha states
./bin/ha config-entries
./bin/ha entity-registry
./bin/ha inventory
./bin/ha logs 300
```

Inspect internal storage safely:

```bash
./bin/ha storage-list
./bin/ha storage-read core.config_entries
```

Edit files under:

```text
config/
```

Review:

```bash
git diff
./bin/ha diff
```

Validate:

```bash
./bin/ha validate
```

Deploy from Claude Code using:

```text
/ha-deploy
```

## Troubleshooting

### `Status: ! Needs authentication`

You are probably still using a direct HTTP MCP configuration.

Remove it and re-add Home Assistant using the stdio proxy setup.

### Browser says `Invalid redirect URI`

Do not use the direct OAuth flow for this setup.

Use:

```text
Claude Code
→ stdio
→ mcp-proxy
→ Bearer token
→ Home Assistant /api/mcp
```

### Claude says `MCP error -32000: Connection closed`

Inspect:

```bash
cat "/tmp/ha-mcp-proxy.$(/usr/bin/id -u).log"
```

If it contains:

```text
ImportError: cannot import name 'request_ctx'
```

reinstall with:

```bash
uv tool install mcp-proxy --with "mcp<2.0.0" --force
```

### `./bin/ha pull` says `rsync: command not found`

The error is usually from the Home Assistant side, not the Mac.

The Terminal & SSH app container does not necessarily include `rsync` by default.

Configure:

```yaml
apks:
  - rsync
```

in:

```text
Home Assistant
→ Settings
→ Apps
→ Terminal & SSH
→ Configuration
```

Save, restart the app, then verify:

```bash
./bin/ha ssh-shell 'which rsync && rsync --version'
```

Retry:

```bash
./bin/ha pull
```

### Keychain token cannot be found

Verify:

```bash
/usr/bin/security find-generic-password   -a "$(/usr/bin/id -un)"   -s "claude-homeassistant-api-token"
```

If missing, rerun:

```bash
./bin/bootstrap
```

or store a new Home Assistant Long-Lived Access Token in Keychain.

### Home Assistant returns `401 Unauthorized`

The Long-Lived Access Token is invalid or revoked. Create a new token and replace the Keychain entry.

### Home Assistant returns `404` for `/api/mcp`

Make sure the **Model Context Protocol Server** integration is installed and configured.

### `homeassistant.local` cannot be resolved

Use the Home Assistant server's LAN IP or another stable local hostname and update the repository configuration accordingly.

## Security notes

Keep these boundaries:

- do not expose Home Assistant SSH directly to the internet;
- do not commit `secrets.yaml`;
- do not commit `.storage`;
- do not store the HA token in `.env`, `.mcp.json`, or `CLAUDE.md`;
- do not run Claude Code in bypass-permissions mode in this repository;
- do not give Claude HAOS host-root SSH for normal administration;
- prefer supported Home Assistant APIs over direct `.storage` mutation;
- create a Home Assistant backup before substantial production changes.

The intended privilege model is:

```text
Broad inspection
      ↓
Local Git-controlled changes
      ↓
Validation
      ↓
Explicit deployment
      ↓
Post-change verification
```

## Final expected state

```bash
claude mcp get HA
```

should show:

```text
Status: ✓ Connected
Type: stdio
```

and:

```bash
./bin/ha status
```

should successfully query the live Home Assistant installation.

At that point Claude Code has access to:

- Home Assistant MCP
- REST API
- WebSocket API
- live entities and actions
- config entries
- entity registry
- `/config`
- YAML configuration
- dashboards
- custom components
- redacted `.storage`
- Core logs
- Home Assistant CLI
- Supervisor
- apps
- backups

without requiring unrestricted HAOS host-root access.
