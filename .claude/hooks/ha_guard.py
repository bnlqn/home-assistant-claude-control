#!/usr/bin/env python3
"""
Claude Code PreToolUse guard for Home Assistant operations.

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
     "Backup restore requires an explicit recovery procedure outside the normal workflow.")
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
