---
name: ha-diagnose
description: Systematically diagnose a Home Assistant entity, automation, integration, device or runtime failure without changing production first.
allowed-tools: Bash(./bin/ha status) Bash(./bin/ha states *) Bash(./bin/ha config-entries *) Bash(./bin/ha entity-registry) Bash(./bin/ha inventory) Bash(./bin/ha logs *) Bash(./bin/ha error-log) Bash(./bin/ha storage-read *) Bash(./bin/ha remote-file *)
---

# Diagnose Home Assistant

Do not mutate production during the initial diagnostic pass.

For the affected object, establish:

1. Is the entity/config entry present?
2. Is it loaded, disabled, unavailable or unknown?
3. Which integration owns it?
4. Is it YAML-managed or UI/config-entry managed?
5. What do current Core logs say?
6. Did a recent config change correlate with failure?
7. Are entity/device IDs in the automation/dashboard still valid?

Prefer evidence over generic Home Assistant troubleshooting advice.

Use targeted state/config-entry reads before broad inventory dumps.

If a configuration fix is found, make it locally under `config/` and validate it
before proposing deployment.
