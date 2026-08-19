#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const LOCAL_CONFIG = path.join(ROOT, ".ha-local.json");
const CONFIG_DIR = path.join(ROOT, "config");
const PANEL_DIR = path.join(ROOT, "panel");
const PANEL_ARTIFACT = path.join(CONFIG_DIR, "www", "home-dashboard", "home-dashboard-panel.js");
const CONFIG_YAML = path.join(CONFIG_DIR, "configuration.yaml");

function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function readLocalConfig() {
  if (!fs.existsSync(LOCAL_CONFIG)) {
    die("Missing .ha-local.json. Run ./bin/bootstrap first.");
  }
  const cfg = JSON.parse(fs.readFileSync(LOCAL_CONFIG, "utf8"));
  for (const key of ["baseUrl", "sshHost", "sshPort", "sshUser", "sshKey"]) {
    if (cfg[key] === undefined || cfg[key] === null || cfg[key] === "") {
      die(`Missing ${key} in .ha-local.json`);
    }
  }
  return cfg;
}

function keychainToken(cfg) {
  if (process.platform !== "darwin") {
    if (process.env.HA_TOKEN) return process.env.HA_TOKEN;
    die("No macOS Keychain available. Set HA_TOKEN or adapt keychainToken() to your secret store.");
  }
  const service = cfg.keychainService || "claude-homeassistant-api-token";
  try {
    return execFileSync(
      "security",
      ["find-generic-password", "-a", os.userInfo().username, "-s", service, "-w"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
  } catch {
    die(`Home Assistant API token not found in macOS Keychain service "${service}". Run ./bin/bootstrap.`);
  }
}

function sshArgs(cfg, remoteCommand) {
  const args = [
    "-i", cfg.sshKey,
    "-p", String(cfg.sshPort),
    "-o", "IdentitiesOnly=yes",
    "-o", "BatchMode=yes",
    "-o", "StrictHostKeyChecking=accept-new",
    `${cfg.sshUser}@${cfg.sshHost}`,
  ];
  if (remoteCommand !== undefined) args.push(remoteCommand);
  return args;
}

function ssh(cfg, command, { capture = true } = {}) {
  if (capture) {
    try {
      return execFileSync("ssh", sshArgs(cfg, command), {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
      });
    } catch (err) {
      if (err.stdout) process.stdout.write(String(err.stdout));
      if (err.stderr) process.stderr.write(String(err.stderr));
      process.exit(err.status || 1);
    }
  }

  const result = spawnSync("ssh", sshArgs(cfg, command), { stdio: "inherit" });
  process.exitCode = result.status ?? 1;
  return "";
}

async function api(cfg, method, endpoint, body = undefined) {
  const token = keychainToken(cfg);
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${cfg.baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const init = { method, headers };
  if (body !== undefined) init.body = JSON.stringify(body);

  const response = await fetch(url, init);
  const text = await response.text();
  if (!response.ok) {
    die(`HTTP ${response.status} ${response.statusText}\n${text}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try { return JSON.parse(text); } catch {}
  }
  return text;
}

async function ws(cfg, payload) {
  const token = keychainToken(cfg);
  const wsUrl = cfg.baseUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:") + "/api/websocket";

  return await new Promise((resolve, reject) => {
    const socket = new WebSocket(wsUrl);
    let sent = false;
    let msgId = 1;

    const timer = setTimeout(() => {
      try { socket.close(); } catch {}
      reject(new Error("WebSocket request timed out"));
    }, 30000);

    socket.onmessage = (event) => {
      let message;
      try { message = JSON.parse(String(event.data)); }
      catch { return; }

      if (message.type === "auth_required") {
        socket.send(JSON.stringify({ type: "auth", access_token: token }));
        return;
      }

      if (message.type === "auth_invalid") {
        clearTimeout(timer);
        socket.close();
        reject(new Error("Home Assistant WebSocket authentication failed"));
        return;
      }

      if (message.type === "auth_ok" && !sent) {
        sent = true;
        const outgoing = { ...payload };
        if (outgoing.id === undefined) outgoing.id = msgId;
        msgId = outgoing.id;
        socket.send(JSON.stringify(outgoing));
        return;
      }

      if ((message.type === "result" || message.type === "pong") && message.id === msgId) {
        clearTimeout(timer);
        socket.close();
        if (message.type === "result" && message.success === false) {
          reject(new Error(JSON.stringify(message.error || message, null, 2)));
        } else {
          resolve(message.result ?? message);
        }
      }
    };

    socket.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Home Assistant WebSocket connection failed"));
    };
  });
}

function print(value) {
  if (typeof value === "string") {
    process.stdout.write(value);
    if (!value.endsWith("\n")) process.stdout.write("\n");
  } else {
    console.log(JSON.stringify(value, null, 2));
  }
}

const SECRET_KEY_RE = /(pass(word)?|secret|token|api[_-]?key|access[_-]?key|refresh[_-]?token|credential|client[_-]?secret|private[_-]?key|authorization|bearer|webhook[_-]?id|pin|psk)/i;

function redact(value, parentKey = "") {
  if (Array.isArray(value)) return value.map((v) => redact(v, parentKey));
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (SECRET_KEY_RE.test(k)) out[k] = "<redacted>";
      else out[k] = redact(v, k);
    }
    return out;
  }
  if (SECRET_KEY_RE.test(parentKey) && value !== null) return "<redacted>";
  return value;
}

function ensureSafeRelativeConfigPath(rel) {
  if (!rel || path.isAbsolute(rel)) die("Path must be relative to /config.");
  const normalized = path.posix.normalize(rel.replaceAll("\\", "/"));
  if (normalized === ".." || normalized.startsWith("../")) die("Path traversal outside /config is not allowed.");
  return normalized;
}

function shellQuote(s) {
  return "'" + String(s).replaceAll("'", "'\"'\"'") + "'";
}

function parseRemoteJson(cfg, command) {
  const text = ssh(cfg, command).trim();
  if (!text) return null;
  try { return JSON.parse(text); }
  catch { return { raw: text }; }
}

function runRsync(args) {
  const result = spawnSync("rsync", args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function rsyncSshCommand(cfg) {
  return `ssh -i ${shellQuote(cfg.sshKey)} -p ${Number(cfg.sshPort)} -o IdentitiesOnly=yes -o BatchMode=yes -o StrictHostKeyChecking=accept-new`;
}

function pullConfig(cfg) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });

  const gitStatus = spawnSync("git", ["status", "--porcelain", "--", "config"], {
    cwd: ROOT, encoding: "utf8"
  });
  if (gitStatus.status === 0 && gitStatus.stdout.trim()) {
    die("Refusing pull: config/ has local Git changes. Commit/stash them first so live config does not overwrite work.");
  }

  const remote = `${cfg.sshUser}@${cfg.sshHost}:/config/`;
  const excludes = [
    ".storage/",
    ".cache/",
    ".ha_run.lock",
    "secrets.yaml",
    "home-assistant_v2.db*",
    "*.db",
    "*.db-shm",
    "*.db-wal",
    "*.log",
    "home-assistant.log*",
    "backups/",
    "backup/",
    "tts/",
    "deps/",
    ".cloud/",
    ".HA_VERSION",
    ".uuid",
  ];

  const args = ["-a", "--checksum", "--delete-excluded"];
  for (const e of excludes) args.push("--exclude", e);
  args.push("-e", rsyncSshCommand(cfg), remote, `${CONFIG_DIR}/`);
  runRsync(args);
}

function diffRemote(cfg) {
  if (!fs.existsSync(CONFIG_DIR)) die("config/ does not exist.");
  const remote = `${cfg.sshUser}@${cfg.sshHost}:/config/`;
  const excludes = [
    ".storage/",
    ".cache/",
    ".ha_run.lock",
    "secrets.yaml",
    "home-assistant_v2.db*",
    "*.db",
    "*.db-shm",
    "*.db-wal",
    "*.log",
    "home-assistant.log*",
    "backups/",
    "backup/",
    "tts/",
    "deps/",
    ".cloud/",
    ".HA_VERSION",
    ".uuid",
  ];
  const args = ["-ani", "--checksum"];
  for (const e of excludes) args.push("--exclude", e);
  args.push("-e", rsyncSshCommand(cfg), `${CONFIG_DIR}/`, remote);
  runRsync(args);
}

async function validate(cfg) {
  console.log("== Local tracked configuration vs live HA ==");
  diffRemote(cfg);

  console.log("\n== Home Assistant REST configuration check ==");
  try {
    const result = await api(cfg, "POST", "/api/config/core/check_config");
    print(result);
    if (result && result.result && result.result !== "valid") {
      process.exitCode = 2;
      return;
    }
  } catch (err) {
    console.error(String(err.message || err));
    console.error("REST check unavailable; falling back to Supervisor CLI check.");
  }

  console.log("\n== Supervisor/Core configuration check ==");
  const result = spawnSync("ssh", sshArgs(cfg, "ha core check"), { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Build the custom dashboard panel and, with --stamp, pin a content-hash
// cache-buster onto its module_url. This kills the "edited panel/src but the
// browser still serves the old bundle" foot-gun: the built artifact provably
// changes, and --stamp makes the URL change too. It does NOT deploy — pushing
// to production stays the user-controlled /ha-deploy step.
async function panelBuild(cfg, { stamp } = {}) {
  if (!fs.existsSync(PANEL_DIR)) die("panel/ does not exist.");

  console.log("== Building panel (tsc + vite) ==");
  const build = spawnSync("npm", ["--prefix", PANEL_DIR, "run", "build"], { stdio: "inherit" });
  if (build.status !== 0) process.exit(build.status ?? 1);

  if (!fs.existsSync(PANEL_ARTIFACT)) {
    die(`Build did not produce ${path.relative(ROOT, PANEL_ARTIFACT)}.`);
  }
  const bytes = fs.readFileSync(PANEL_ARTIFACT);
  const hash = crypto.createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  const sizeKb = (bytes.length / 1000).toFixed(2); // SI kB, to match vite's report
  console.log(`\nBuilt ${path.relative(ROOT, PANEL_ARTIFACT)} — ${sizeKb} kB, content hash ${hash}`);

  if (!stamp) {
    console.log(
      "\nDev loop: hard-reload the browser to serve the new bundle (no restart).\n" +
        "Prod cut: re-run with --stamp to pin ?v= in configuration.yaml, then deploy via /ha-deploy."
    );
    return;
  }

  // Rewrite (or add) the ?v= query on the panel's module_url line only.
  const yaml = fs.readFileSync(CONFIG_YAML, "utf8");
  const re = /(module_url:\s*\/local\/home-dashboard\/home-dashboard-panel\.js)(\?v=[0-9a-f]+)?/;
  if (!re.test(yaml)) {
    die(`Could not find the panel module_url line in ${path.relative(ROOT, CONFIG_YAML)}.`);
  }
  const stamped = yaml.replace(re, `$1?v=${hash}`);
  if (stamped === yaml) {
    console.log(`module_url already stamped with ?v=${hash} — nothing to change.`);
  } else {
    fs.writeFileSync(CONFIG_YAML, stamped);
    console.log(`Stamped module_url with ?v=${hash} in ${path.relative(ROOT, CONFIG_YAML)}.`);
  }
  console.log(
    "\nNOTE: module_url lives in configuration.yaml, so stamping changes the panel\n" +
      "registration — it needs a Core restart to serve. Deploy + restart via /ha-deploy."
  );

  console.log("\n== Validating configuration ==");
  await validate(cfg);
}

function deploy(cfg, withDelete = false) {
  if (!fs.existsSync(CONFIG_DIR)) die("config/ does not exist.");

  const remote = `${cfg.sshUser}@${cfg.sshHost}:/config/`;
  const excludes = [
    ".storage/",
    ".cache/",
    ".ha_run.lock",
    "secrets.yaml",
    "home-assistant_v2.db*",
    "*.db",
    "*.db-shm",
    "*.db-wal",
    "*.log",
    "home-assistant.log*",
    "backups/",
    "backup/",
    "tts/",
    "deps/",
    ".cloud/",
    ".HA_VERSION",
    ".uuid",
  ];

  const args = ["-av", "--checksum"];
  if (withDelete) args.push("--delete");
  for (const e of excludes) args.push("--exclude", e);
  args.push("-e", rsyncSshCommand(cfg), `${CONFIG_DIR}/`, remote);
  runRsync(args);

  console.log("\nRunning Home Assistant configuration check after transfer...");
  const result = spawnSync("ssh", sshArgs(cfg, "ha core check"), { stdio: "inherit" });
  if (result.status !== 0) {
    console.error("\nWARNING: files were transferred but Home Assistant config check failed.");
    console.error("Do NOT restart Core. Fix or restore the configuration.");
    process.exit(result.status ?? 1);
  }
}

function storageList(cfg) {
  const output = ssh(cfg, "find /config/.storage -maxdepth 1 -type f -printf '%f\\n' 2>/dev/null || ls -1 /config/.storage");
  const names = output.split(/\r?\n/).map((x) => x.trim()).filter(Boolean).sort();
  print(names);
}

function storageRead(cfg, name, raw = false) {
  if (!/^[A-Za-z0-9_.-]+$/.test(name || "")) {
    die("Storage name must contain only letters, numbers, dot, underscore or dash.");
  }
  const remotePath = `/config/.storage/${name}`;
  const text = ssh(cfg, `cat ${shellQuote(remotePath)}`);
  if (raw) {
    process.stdout.write(text);
    return;
  }
  try {
    print(redact(JSON.parse(text)));
  } catch {
    die(`Storage object ${name} is not valid JSON; raw output withheld. Use storage-read-raw explicitly if required.`);
  }
}

function remoteFile(cfg, rel, raw = false) {
  const safe = ensureSafeRelativeConfigPath(rel);
  if (!raw) {
    if (safe === "secrets.yaml" || safe.startsWith(".storage/")) {
      die("Sensitive/internal path. Use storage-read for .storage or remote-file-raw through the explicit sensitive-read workflow.");
    }
  }
  const text = ssh(cfg, `cat ${shellQuote(`/config/${safe}`)}`);
  if (raw) {
    process.stdout.write(text);
    return;
  }
  process.stdout.write(text);
}

function cli(cfg, args) {
  if (!args.length) die("ssh-cli requires Home Assistant CLI arguments.");
  const cmd = "ha " + args.map(shellQuote).join(" ");
  ssh(cfg, cmd, { capture: false });
}

function shell(cfg, args) {
  if (!args.length) die("ssh-shell requires a remote shell command.");
  ssh(cfg, args.join(" "), { capture: false });
}

function help() {
  console.log(`
Home Assistant control helper

Usage:
  ./bin/ha <command> [args]

Read / inspect:
  help
  status
  ssh-test
  states [entity_id]
  services
  components
  config-runtime
  error-log
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
  remote-file <relative-path>

Advanced read:
  storage-read-raw <name>
  remote-file-raw <relative-path>
  ws '<json>'

Config workflow:
  pull
  diff
  validate
  backup [name]
  panel-build [--stamp]
  deploy [--delete]
  reload-automations
  reload-scripts
  reload-scenes
  restart

Escape hatches:
  ssh-cli <ha CLI arguments...>
  ssh-shell <remote shell command...>
  rest <METHOD> <path> ['<json-body>']
`);
}

async function main() {
  const [command = "help", ...args] = process.argv.slice(2);
  if (command === "help") return help();

  const cfg = readLocalConfig();

  switch (command) {
    case "ssh-test": {
      print(ssh(cfg, "echo SSH_OK && pwd && ha core info --raw-json"));
      break;
    }

    case "status": {
      const [apiRoot, runtime] = await Promise.all([
        api(cfg, "GET", "/api/"),
        api(cfg, "GET", "/api/config"),
      ]);
      const core = parseRemoteJson(cfg, "ha core info --raw-json");
      print({ api: apiRoot, runtime: {
        version: runtime.version,
        location_name: runtime.location_name,
        time_zone: runtime.time_zone,
        state: runtime.state,
        safe_mode: runtime.safe_mode,
        recovery_mode: runtime.recovery_mode,
      }, core });
      break;
    }

    case "states": {
      if (args[0]) print(await api(cfg, "GET", `/api/states/${encodeURIComponent(args[0])}`));
      else print(await api(cfg, "GET", "/api/states"));
      break;
    }

    case "services":
      print(await api(cfg, "GET", "/api/services"));
      break;

    case "components":
      print(await api(cfg, "GET", "/api/components"));
      break;

    case "config-runtime":
      print(await api(cfg, "GET", "/api/config"));
      break;

    case "error-log":
      print(await api(cfg, "GET", "/api/error_log"));
      break;

    case "config-entries": {
      const payload = { type: "config_entries/get" };
      if (args[0]) payload.domain = args[0];
      print(await ws(cfg, payload));
      break;
    }

    case "entity-registry":
      print(await ws(cfg, { type: "config/entity_registry/list_for_display" }));
      break;

    case "exposed-entities":
      print(await ws(cfg, { type: "homeassistant/expose_entity/list" }));
      break;

    case "ws": {
      if (!args[0]) die("ws requires one JSON object argument.");
      let payload;
      try { payload = JSON.parse(args.join(" ")); }
      catch { die("Invalid JSON supplied to ws."); }
      delete payload.id;
      print(await ws(cfg, payload));
      break;
    }

    case "core-info":
      print(parseRemoteJson(cfg, "ha core info --raw-json"));
      break;

    case "supervisor-info":
      print(parseRemoteJson(cfg, "ha supervisor info --raw-json"));
      break;

    case "apps":
      print(parseRemoteJson(cfg, "ha apps --raw-json"));
      break;

    case "backups":
      print(parseRemoteJson(cfg, "ha backups --raw-json"));
      break;

    case "logs": {
      const lines = Math.max(1, Math.min(Number(args[0] || 200), 5000));
      const text = ssh(cfg, "ha core logs");
      const sliced = text.split(/\r?\n/).slice(-lines).join("\n");
      print(sliced);
      break;
    }

    case "storage-list":
      storageList(cfg);
      break;

    case "storage-read":
      if (!args[0]) die("storage-read requires a storage object name.");
      storageRead(cfg, args[0], false);
      break;

    case "storage-read-raw":
      if (!args[0]) die("storage-read-raw requires a storage object name.");
      storageRead(cfg, args[0], true);
      break;

    case "remote-file":
      if (!args[0]) die("remote-file requires a path relative to /config.");
      remoteFile(cfg, args[0], false);
      break;

    case "remote-file-raw":
      if (!args[0]) die("remote-file-raw requires a path relative to /config.");
      remoteFile(cfg, args[0], true);
      break;

    case "inventory": {
      const [runtime, entries, entities, exposed] = await Promise.all([
        api(cfg, "GET", "/api/config"),
        ws(cfg, { type: "config_entries/get" }),
        ws(cfg, { type: "config/entity_registry/list_for_display" }),
        ws(cfg, { type: "homeassistant/expose_entity/list" }),
      ]);

      let storage = [];
      try {
        const output = ssh(cfg, "find /config/.storage -maxdepth 1 -type f -printf '%f\\n' 2>/dev/null || ls -1 /config/.storage");
        storage = output.split(/\r?\n/).map(x => x.trim()).filter(Boolean).sort();
      } catch {}

      const entityList = entities?.entities || [];
      const platformCounts = {};
      const areaCounts = {};
      for (const entity of entityList) {
        platformCounts[entity.pl || "<unknown>"] = (platformCounts[entity.pl || "<unknown>"] || 0) + 1;
        if (entity.ai) areaCounts[entity.ai] = (areaCounts[entity.ai] || 0) + 1;
      }

      print({
        runtime: {
          version: runtime.version,
          location_name: runtime.location_name,
          time_zone: runtime.time_zone,
          components_count: runtime.components?.length ?? null,
        },
        config_entries: entries,
        entity_summary: {
          enabled_entity_count: entityList.length,
          by_platform: Object.fromEntries(Object.entries(platformCounts).sort((a,b) => b[1]-a[1])),
          by_area_id: Object.fromEntries(Object.entries(areaCounts).sort((a,b) => b[1]-a[1])),
        },
        exposed_entities: exposed,
        storage_objects: storage,
      });
      break;
    }

    case "pull":
      pullConfig(cfg);
      console.log("Pulled non-sensitive /config content into config/.");
      break;

    case "diff":
      diffRemote(cfg);
      break;

    case "validate":
      await validate(cfg);
      break;

    case "backup": {
      const name = args.join(" ") || `Claude pre-change ${new Date().toISOString()}`;
      const result = spawnSync("ssh", sshArgs(cfg, `ha backups new --name ${shellQuote(name)}`), { stdio: "inherit" });
      if (result.status !== 0) process.exit(result.status ?? 1);
      break;
    }

    case "panel-build":
      await panelBuild(cfg, { stamp: args.includes("--stamp") });
      break;

    case "deploy":
      deploy(cfg, args.includes("--delete"));
      break;

    case "restart":
      ssh(cfg, "ha core restart", { capture: false });
      break;

    case "reload-automations":
      print(await api(cfg, "POST", "/api/services/automation/reload", {}));
      break;

    case "reload-scripts":
      print(await api(cfg, "POST", "/api/services/script/reload", {}));
      break;

    case "reload-scenes":
      print(await api(cfg, "POST", "/api/services/scene/reload", {}));
      break;

    case "ssh-cli":
      cli(cfg, args);
      break;

    case "ssh-shell":
      shell(cfg, args);
      break;

    case "rest": {
      const [method, path, ...bodyParts] = args;
      if (!method || !path) die("rest requires METHOD and PATH arguments.");
      let body;
      if (bodyParts.length) {
        try { body = JSON.parse(bodyParts.join(" ")); }
        catch { die("Invalid JSON supplied to rest."); }
      }
      print(await api(cfg, method.toUpperCase(), path, body));
      break;
    }

    default:
      die(`Unknown command: ${command}\nRun ./bin/ha help`);
  }
}

main().catch((err) => die(err?.stack || String(err)));
