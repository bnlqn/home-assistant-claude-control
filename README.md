# Home Assistant × Claude Code Control Plane

A production-oriented Claude Code workspace for administering a Home Assistant installation.

This repository intentionally uses **multiple access paths** instead of pretending that Home Assistant MCP is a full administration API:

- **Home Assistant MCP** → semantic entity context and Assist tools.
- **Home Assistant REST/WebSocket APIs** → states, actions, runtime config, config entries, validation, registries, exposure settings, etc.
- **Terminal & SSH app** → `/config` and the Supervisor-backed `ha` CLI.
- **Git-tracked local mirror** → safe reviewable YAML/custom-component/dashboard changes.
- **Read-only/redacted `.storage` inspection** → discovery and diagnosis when a supported API is not enough.

The default policy is intentionally asymmetric:

> Claude may inspect very broadly, but production mutations are routed through explicit workflows.

That gives Claude enough information to genuinely understand the installation without letting an accidental `sed -i` against `.storage/core.config_entries` ruin Home Assistant.

---

## Assumptions

The included bootstrap targets:

- macOS for the Claude Code machine.
- Home Assistant OS on the server.
- The official **Terminal & SSH** Home Assistant app.
- Claude Code 2.1.203+ recommended.
- Node.js 22+ recommended.

If your Home Assistant installation is Container/Core rather than Home Assistant OS, the REST/WebSocket layer still works, but the SSH/Supervisor portions need adapting.

---

# Architecture

```text
                         Claude Code
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
   Home Assistant MCP     ./bin/ha           local config/
      OAuth session           │                    │
          │         ┌─────────┴─────────┐          │
          │         │                   │          │
          ▼         ▼                   ▼          ▼
       Assist    HA REST/WS          SSH app      Git
       tools         API             /config
                                       │
                                       ▼
                                    ha CLI
                                       │
                                       ▼
                                  Supervisor
```

The **HAOS host SSH port 22222 is deliberately not part of the normal setup**.

---

# Repository layout

```text
.
├── CLAUDE.md
├── README.md
├── .gitignore
├── .mcp.json.example
├── .claude/
│   ├── settings.json
│   ├── hooks/
│   │   └── ha_guard.py
│   └── skills/
│       ├── home-assistant/
│       │   └── SKILL.md
│       ├── ha-deploy/
│       │   └── SKILL.md
│       ├── ha-diagnose/
│       │   └── SKILL.md
│       ├── ha-dashboard/
│       │   └── SKILL.md
│       └── ha-sensitive-read/
│           └── SKILL.md
├── bin/
│   ├── bootstrap
│   └── ha
├── tools/
│   └── ha.mjs
├── config/
│   └── .gitkeep
└── docs/
    ├── ACCESS-MODEL.md
    ├── OPERATIONS.md
    └── SECURITY.md
```

---

# Step 1 — install Home Assistant Terminal & SSH

In Home Assistant:

**Settings → Apps → App store → Terminal & SSH**

Configure an SSH public key and expose an SSH port to your LAN.

Do **not** expose it through your internet router.

The bootstrap script generates a dedicated key for this workspace and prints the public key for you to paste into the app configuration.

Example Home Assistant app configuration after bootstrap:

```yaml
authorized_keys:
  - "ecdsa-sha2-nistp521 AAAA... claude-homeassistant"
password: ""
apks: []
server:
  tcp_forwarding: false
```

Then choose a host port in the app Network section. `22` or `2222` are both fine; this repo does not assume either.

---

# Step 2 — bootstrap the local workspace

Run:

```bash
./bin/bootstrap
```

It asks for:

- Home Assistant URL
- SSH hostname/IP
- SSH port
- SSH key path
- a Home Assistant long-lived API token

The token is written to **macOS Keychain**, not to this repository.

The non-secret machine configuration is saved to:

```text
.ha-local.json
```

That file is gitignored.

The bootstrap script also prints the generated SSH public key.

Paste it into the Home Assistant Terminal & SSH app, restart that app, then test:

```bash
./bin/ha ssh-test
./bin/ha status
```

---

# Step 3 — configure Home Assistant MCP using OAuth

Home Assistant's MCP endpoint is:

```text
https://YOUR_HOME_ASSISTANT/api/mcp
```

For Claude Code, use the OAuth flow rather than putting a long-lived token into `.mcp.json`.

The safest setup is to configure MCP in Claude Code's local/user configuration:

```bash
claude mcp add-json "HA" '{
  "type": "http",
  "url": "https://YOUR_HOME_ASSISTANT/api/mcp",
  "oauth": {
    "clientId": "http://localhost:12345",
    "callbackPort": 12345
  }
}' --client-secret
```

Then start Claude Code:

```bash
claude
```

and run:

```text
/mcp
```

Select `HA` → **Authenticate**.

Your browser opens Home Assistant. Approve the OAuth login.

## Local HTTP Home Assistant URL

OAuth is easiest when Home Assistant is available to your Mac through a URL that Home Assistant considers valid for its auth redirect flow.

If you currently only use something like:

```text
http://192.168.x.x:8123
```

you can still use the REST/WS/SSH control plane immediately. If Claude Code's direct MCP OAuth flow gives you trouble, either:

1. use your normal HTTPS Home Assistant URL over your LAN/VPN, or
2. configure the MCP separately with Home Assistant's documented local proxy approach.

The rest of this repository does not depend on MCP being present.

---

# Step 4 — take the first configuration snapshot

```bash
./bin/ha pull
```

`pull` copies normal Home Assistant configuration into `config/`.

It deliberately excludes:

- `.storage/`
- `secrets.yaml`
- Home Assistant databases
- logs
- backups
- transient caches
- credentials and auth storage

`.storage` is inspected **on demand**, through redacting commands.

Commit the baseline:

```bash
git add .
git commit -m "Baseline Home Assistant configuration"
```

Now Claude can make normal configuration changes in `config/` and Git gives you a complete diff.

---

# Step 5 — use Claude Code

Start Claude from the repository root:

```bash
claude
```

Useful prompts:

```text
Analyze my Home Assistant architecture. Inspect the live instance rather than
assuming config/ is current. Identify devices, integrations, areas, major
automations, and dashboard structure.
```

```text
Why does automation.foo not fire? Diagnose it using live states, config entries,
logs and the YAML configuration. Do not change anything yet.
```

```text
Add a motion-based kitchen lighting automation using the conventions already in
my configuration. Validate it against the live entity IDs.
```

```text
Redesign my mobile Home dashboard. First inspect the live dashboard storage and
existing custom cards, then propose the structure and implement it.
```

For production deployment, invoke:

```text
/ha-deploy
```

For unusually sensitive `.storage` inspection:

```text
/ha-sensitive-read core.config_entries
```

---

# `./bin/ha` commands

Run:

```bash
./bin/ha help
```

Core commands:

```text
status
ssh-test

states [entity_id]
services
components
config-runtime
error-log

ws <json>
config-entries [domain]
entity-registry
exposed-entities
inventory

core-info
supervisor-info
apps
backups
logs [lines]

storage-list
storage-read <name>
storage-read-raw <name>

remote-file <relative-path>
remote-file-raw <relative-path>

pull
diff
validate
backup [name]
deploy
deploy --delete
restart
reload-automations
reload-scripts
reload-scenes

ssh-cli <ha CLI arguments...>
ssh-shell <shell command...>
```

The last three categories are increasingly privileged.

---

# Recommended operating model

## Normal read / diagnosis

Claude may freely use:

```text
./bin/ha status
./bin/ha states
./bin/ha config-entries
./bin/ha entity-registry
./bin/ha inventory
./bin/ha logs
./bin/ha storage-read ...
```

## Normal configuration work

Claude edits only:

```text
config/
```

Then:

```text
./bin/ha diff
./bin/ha validate
```

## Production application

Use `/ha-deploy`.

The deployment workflow is:

1. refuse if configuration has not been inspected;
2. show Git diff;
3. create a Home Assistant backup;
4. run a pre-deployment live configuration check;
5. rsync local config to `/config`;
6. run `ha core check`;
7. reload the smallest relevant domain when possible;
8. restart Core only when necessary;
9. verify the resulting runtime state/logs.

---

# Why `.storage` is not synchronized into Git

Modern Home Assistant stores important UI-managed configuration under:

```text
/config/.storage/
```

Examples include registries, dashboards, config entries, helpers and authentication data.

Those files can also contain credentials or implementation details that should not be committed.

This workspace therefore treats `.storage` like a database:

- **read it when necessary**
- **redact by default**
- **use supported HA APIs for writes**
- **never blindly patch it**
- **never commit it**

`./bin/ha storage-read` recursively redacts values whose keys look like secrets,
tokens, passwords, API keys, credentials, refresh tokens, access tokens, private
keys, etc.

For an explicit raw read, use the manually invoked `/ha-sensitive-read` skill.

---

# Do I need host-root SSH?

No for normal Home Assistant administration.

The Terminal & SSH app gives:

- `/config`
- Home Assistant CLI (`ha`)
- Supervisor-backed administration

It does **not** give unrestricted HAOS host root.

That is a feature here, not a limitation.

If you ever genuinely need the HAOS host debug SSH port (`22222`) for recovery or
operating-system debugging, keep it outside this Claude Code workspace.

---

# Git strategy

Recommended:

```text
main       = known-good production configuration
feature/*  = substantial HA changes
```

Before large work:

```bash
git switch -c feature/new-dashboard
```

Claude can work locally, validate, and show you a diff before applying it.

Do not add:

```text
secrets.yaml
.storage/
*.db
*.log
backups/
```

---

# What “full access” means in this design

Claude can:

- query every normal runtime entity through HA APIs
- invoke HA actions/services
- inspect config entries
- inspect entity exposure
- query current config/components/services
- send raw WebSocket commands
- access `/config`
- read YAML, dashboards, custom components and themes
- inspect `.storage` in redacted form
- inspect apps/Supervisor/Core through `ha`
- inspect logs
- create backups
- deploy configuration
- validate configuration
- reload or restart Home Assistant
- run arbitrary `ha` CLI commands when explicitly needed
- run arbitrary shell commands inside the SSH app when explicitly needed

It deliberately does **not** automatically provide:

- unrestricted HAOS host-root SSH
- automatic raw secret disclosure
- unattended direct `.storage` mutation
- unconstrained destructive `rsync --delete`

Those escape hatches remain available only as deliberate operations.
