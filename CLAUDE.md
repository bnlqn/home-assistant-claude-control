# Home Assistant production control plane

You are operating against a real Home Assistant installation.

Your goal is to be highly capable **without confusing broad access with careless mutation**.

## Source-of-truth hierarchy

Different parts of Home Assistant have different authoritative sources.

1. **Live HA REST/WebSocket API**
   - current states
   - services/actions
   - loaded components
   - runtime configuration
   - config-entry state
   - entity exposure
   - validation

2. **Home Assistant MCP**
   - semantic Home Assistant context
   - Assist-exposed entities/tools
   - convenient natural home-control operations

   MCP is NOT a complete administrative representation of Home Assistant.

3. **SSH `/config`**
   - YAML configuration
   - automations/scripts/scenes stored in YAML
   - YAML dashboards
   - custom components
   - themes
   - www assets
   - selected diagnostic access to `.storage`

4. **Supervisor through `ha` CLI**
   - Home Assistant Core
   - apps
   - backups
   - Supervisor
   - OS/system information exposed by the CLI

5. **`.storage`**
   - internal persistence for UI-managed Home Assistant data
   - useful as a read-side diagnostic source
   - not a normal source-editing surface

## UniFi Network Controller

The UniFi Controller (Dream Machine) is a **separate system from Home
Assistant**, with its own access boundary — not part of the hierarchy above.

`./bin/unifi` reaches the official UniFi Network Integration API v1 for
client/device/network inspection and action (endpoint list verified against
the console's own bundled docs, v10.5.67 — includes networks/VLANs, WiFi
broadcasts, firewall zones/policies, ACL rules, not just clients/devices).
Its API key is generated from the main admin account and carries full
read/write permission at the credential level — mutation safety comes from
command scoping and Claude Code's permission tiers, not the key. Read
commands are pre-approved; every write command
(`client-authorize-guest`/`client-unauthorize-guest`, `device-restart`, and
the `raw` escape hatch for VLAN/WLAN/firewall-policy create/update/delete)
requires explicit per-call approval and should be treated with the same
care as `./bin/ha deploy`/`restart` — surface what a write call
will do before running it, especially anything touching VLANs, WLANs, or
firewall policy, since a bad call there can disconnect or misconfigure
devices across the house.

Home Assistant's `unifi` config entry (client presence, a few pre-existing
firewall-rule switches, firmware `update.*` entities) remains the correct
source for anything that needs to interact with HA automations/dashboards.
Use `./bin/unifi` for direct controller inspection/action HA doesn't expose.
See `docs/ACCESS-MODEL.md` and `docs/SECURITY.md`.

## Always inspect live state before assuming

`config/` is a Git-controlled working mirror and may be stale.

Before diagnosing or designing something dependent on real entity IDs,
integrations, device state, or UI configuration, inspect the live instance with
`./bin/ha`.

Typical starting commands:

```bash
./bin/ha status
./bin/ha inventory
./bin/ha states
./bin/ha config-entries
```

Use narrower calls when possible to avoid enormous context dumps.

## Access commands

The supported local control interface is:

```bash
./bin/ha ...
```

Prefer it over ad-hoc `curl` or direct `ssh`.

Reasons:

- authentication is handled outside the repository
- output can be redacted
- transport details stay consistent
- dangerous operations are easier to audit
- Claude Code permissions/hooks can reason about a stable command surface

## Reading `.storage`

Use:

```bash
./bin/ha storage-list
./bin/ha storage-read <name>
```

`storage-read` is redacted by default.

Do not request raw storage simply because redaction is inconvenient.

Raw access is reserved for `/ha-sensitive-read` and must be justified by the task.

## Never directly edit `.storage` by default

Do not write to `/config/.storage/*` with:

- sed
- perl
- Python
- jq
- shell redirects
- rsync from a hand-edited local copy
- direct filesystem editing

Instead determine whether the desired change has:

1. a documented Home Assistant REST endpoint,
2. a documented WebSocket command,
3. a Home Assistant service/action,
4. a config/options flow endpoint,
5. YAML configuration,
6. a supported CLI operation.

If none exists, investigate the Home Assistant source/API used by the frontend.

Only consider raw `.storage` mutation as an explicit last-resort recovery
operation.

## Configuration changes

Normal editable files live under:

```text
config/
```

Never put secrets in this repository.

Before editing:

1. inspect relevant existing configuration;
2. inspect live entity/config-entry information;
3. identify whether the object is YAML-managed or UI-managed;
4. preserve the user's existing conventions;
5. make the smallest coherent change.

After editing:

```bash
./bin/ha diff
./bin/ha validate
```

Do not deploy merely because validation passes.

## Deployment

Production deployment is a user-controlled workflow.

Use the `/ha-deploy` skill.

Do not independently invent another deployment procedure.

For the custom dashboard panel specifically, build with `./bin/ha panel-build`
before deploying — editing `panel/src` has no effect until the bundle is rebuilt.
`panel-build --stamp` also pins a content-hash `?v=` on the panel's `module_url`
so a deployed change provably busts the browser cache (at the cost of a Core
restart, since `module_url` lives in `configuration.yaml`). This builds and
stamps only; the actual push still goes through `/ha-deploy`.

Prefer targeted reloads over Core restart.

A Core restart is appropriate when:

- Home Assistant reports restart required,
- integration configuration requires it,
- a custom component changed,
- YAML reload is not supported for the changed domain,
- the user explicitly requests it.

## Git

Use Git as the audit trail.

Before substantial changes, inspect:

```bash
git status --short
git diff
```

Never commit:

- `secrets.yaml`
- `.storage`
- database files
- logs
- backups
- API tokens
- OAuth tokens
- SSH private keys

## Dashboards

First determine whether the dashboard is:

- YAML mode, or
- storage/UI mode.

For YAML mode, edit the tracked YAML normally.

For storage mode:

1. inspect the appropriate storage object in redacted form;
2. prefer Home Assistant's frontend/API mechanisms when an update API is available;
3. do not overwrite the full storage object casually;
4. preserve dashboard IDs, view IDs and unrelated configuration.

Use `/ha-dashboard` when doing substantial dashboard work.

## Automations

Before creating an automation:

1. verify entity IDs live;
2. inspect similar existing automations;
3. prefer stable device/entity semantics;
4. avoid brittle state strings when a dedicated trigger exists;
5. account for unavailable/unknown where relevant;
6. avoid unnecessary restart.

Home Assistant WebSocket `validate_config` can validate trigger/condition/action
structures; full YAML changes must also pass `ha core check`.

## Diagnostics

Use `/ha-diagnose` for non-trivial failures.

Correlate:

- live entity state
- config-entry state
- logs
- YAML
- device/entity metadata
- recent configuration changes

Do not assume a YAML error when an integration is UI-configured.

## Supervisor and apps

Current CLI terminology uses:

```bash
ha apps
```

Prefer `./bin/ha apps` or `./bin/ha ssh-cli apps ...`.

Do not assume old `ha addons` examples from the internet are current.

## Security boundary

The normal workspace intentionally has no HAOS host-root SSH.

Do not attempt to enable or use host debug SSH merely to get more power.

The official Terminal & SSH app plus the HA APIs and Supervisor CLI are the
normal administrative boundary.

## Destructive actions

Before any operation that can destroy or substantially disrupt state, surface
what will happen.

Examples:

- deleting integrations/config entries
- deleting entities/devices
- deleting remote files
- restoring backups
- `deploy --delete`
- raw `.storage` writes
- host/network reconfiguration
- app removal
- OS/Core downgrade
- factory/reset operations

A backup is necessary but does not turn a destructive operation into a trivial
one.

## Preferred behavior

Be autonomous about:

- inspection
- diagnosis
- reading
- local edits
- validation
- explaining changes

Be deliberate about:

- production writes
- restart
- destructive operations
- credentials
- internal storage
