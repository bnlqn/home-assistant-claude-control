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
