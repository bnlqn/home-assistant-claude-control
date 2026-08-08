---
name: ha-sensitive-read
description: Explicitly inspect raw Home Assistant internal storage or a sensitive remote config file when redacted access is insufficient for a specific diagnosis.
disable-model-invocation: true
allowed-tools: Bash(./bin/ha storage-read-raw *) Bash(./bin/ha remote-file-raw *)
---

# Sensitive Home Assistant read

This skill can put credentials or private Home Assistant internals into model
context.

Use it only because the user explicitly invoked this skill.

Argument:

```text
$ARGUMENTS
```

Prefer:

```bash
./bin/ha storage-read "$ARGUMENTS"
```

first if it has not already been tried.

If redaction prevents the required diagnosis and the requested target is a
storage object, use:

```bash
./bin/ha storage-read-raw "$ARGUMENTS"
```

For a normal `/config` path:

```bash
./bin/ha remote-file-raw "$ARGUMENTS"
```

Do not echo unrelated secrets back to the user. Extract only the specific fields
needed to complete the task.
