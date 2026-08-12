#!/usr/bin/env python3
"""
Claude Code PreToolUse guard for Home Assistant and UniFi Controller operations.

This is a second line of defense. Claude Code permission rules are the first.
The hook intentionally blocks patterns that should never be silently normalized
into "just another shell command".
"""
import json
import re
import sys

try:
    payload = json.load(sys.stdin)
except Exception:
    sys.exit(0)

if payload.get("tool_name") != "Bash":
    sys.exit(0)

command = (payload.get("tool_input") or {}).get("command", "")
normalized = " ".join(command.split())

blocked = [
    # Never let the workspace enable/use HAOS host debug/root access casually.
    (r"(^|\s)ssh\b.*(?:-p\s*22222|:22222)\b",
     "HAOS host-root SSH (port 22222) is outside this workspace's normal security boundary."),

    # Direct writes to Home Assistant internal storage.
    (r"(?:^|[;&|]\s*|\s)(?:sed|perl|python3?|ruby|node|jq)\b.*?/config/\.storage/",
     "Direct mutation tooling against /config/.storage is blocked. Use a supported HA API or an explicit recovery procedure."),

    (r"/config/\.storage/[^\s]*\s*(?:>|>>)",
     "Shell redirection into /config/.storage is blocked."),

    # Obvious HA config destruction.
    (r"\brm\s+(?:-[^\s]*\s+)*-?r[fF]?\b.*?/config(?:/|\s|$)",
     "Recursive deletion under Home Assistant /config is blocked."),

    (r"\brm\s+(?:-[^\s]*\s+)*-?f\b.*?/config/(?:configuration\.yaml|automations\.yaml|scripts\.yaml|scenes\.yaml|secrets\.yaml)",
     "Deletion of core Home Assistant configuration files is blocked."),

    # Protect the local API credential from obvious extraction.
    (r"\bsecurity\s+find-generic-password\b.*claude-homeassistant-api-token",
     "Direct extraction of the Home Assistant API token from macOS Keychain is blocked. Use ./bin/ha."),

    # No casual HAOS/system wipe/reformat.
    (r"\bha\s+(?:host|os)\b.*\b(?:wipe|factory|reset|format)\b",
     "Destructive host/OS operation blocked."),

    # Backup restore is explicitly outside the normal autonomous workflow.
    (r"\bha\s+backups?\b.*\brestore\b",
     "Backup restore requires an explicit recovery procedure outside the normal workflow."),

    # UniFi Controller access goes through ./bin/unifi. Block raw HTTP
    # tooling that would bypass its certificate pinning, redaction, and the
    # per-command "ask" permission gating on write commands.
    (r"(?:^|[;&|]\s*|\s)(?:curl|wget|http|httpie)\b.*(?:/proxy/network/|/api/s/[^\s]*)",
     "Direct HTTP access to the UniFi console is blocked. Use ./bin/unifi."),

    # Protect the local UniFi API key credential from obvious extraction.
    (r"\bsecurity\s+find-generic-password\b.*claude-unifi-api-token",
     "Direct extraction of the UniFi API key from macOS Keychain is blocked. Use ./bin/unifi."),

    # The UniFi API key carries full admin permission. ./bin/unifi's `raw`
    # escape hatch has no allowlist of endpoints, so block the obviously
    # catastrophic shapes even though `raw` already requires "ask" approval.
    (r"\./bin/unifi\s+raw\s+DELETE\b",
     "DELETE via the UniFi raw escape hatch is blocked. Delete objects (sites, networks, devices) from the UniFi UI where it's a deliberate, visible action."),

    (r"\./bin/unifi\s+raw\b.*(?:FACTORY_RESET|RESTORE_DEFAULT|\bWIPE\b)",
     "Factory-reset/restore-shaped UniFi action blocked."),
]

for pattern, reason in blocked:
    if re.search(pattern, normalized, flags=re.IGNORECASE):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": reason
            }
        }))
        sys.exit(0)

sys.exit(0)
