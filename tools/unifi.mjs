#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import https from "node:https";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const LOCAL_CONFIG = path.join(ROOT, ".unifi-local.json");

function die(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function readLocalConfig() {
  if (!fs.existsSync(LOCAL_CONFIG)) {
    die("Missing .unifi-local.json. Run ./bin/bootstrap-unifi first.");
  }
  const cfg = JSON.parse(fs.readFileSync(LOCAL_CONFIG, "utf8"));
  for (const key of ["host", "siteId", "certFingerprint256"]) {
    if (!cfg[key]) die(`Missing ${key} in .unifi-local.json`);
  }
  return cfg;
}

function keychainToken(cfg) {
  if (process.platform !== "darwin") {
    if (process.env.UNIFI_API_KEY) return process.env.UNIFI_API_KEY;
    die("No macOS Keychain available. Set UNIFI_API_KEY or adapt keychainToken() to your secret store.");
  }
  const service = cfg.keychainService || "claude-unifi-api-token";
  try {
    return execFileSync(
      "security",
      ["find-generic-password", "-a", os.userInfo().username, "-s", service, "-w"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
  } catch {
    die(`UniFi API key not found in macOS Keychain service "${service}". Run ./bin/bootstrap-unifi.`);
  }
}

// Local UniFi OS consoles present a certificate that isn't in a standard
// trust store. Rather than a blanket `rejectUnauthorized: false` (which
// would trust anything on the LAN claiming to be the console),
// checkServerIdentity pins to the fingerprint captured during
// bootstrap-unifi and rejects any other certificate.
function pinnedAgent(cfg) {
  const expected = cfg.certFingerprint256.toUpperCase();
  return new https.Agent({
    rejectUnauthorized: false,
    checkServerIdentity: (_hostname, cert) => {
      const actual = crypto.createHash("sha256").update(cert.raw).digest("hex")
        .toUpperCase().match(/.{2}/g).join(":");
      if (actual !== expected) {
        return new Error(
          `UniFi console certificate fingerprint changed.\nExpected: ${expected}\nGot:      ${actual}\n` +
          `If this is expected (console re-provisioned, cert renewed), re-run ./bin/bootstrap-unifi to re-pin it.`
        );
      }
      return undefined;
    },
  });
}

function request(cfg, method, endpoint, body = undefined) {
  const key = keychainToken(cfg);
  const agent = pinnedAgent(cfg);
  const url = `https://${cfg.host}/proxy/network/integration/v1${endpoint}`;
  const payload = body === undefined ? undefined : JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = https.request(
      url,
      {
        method,
        agent,
        headers: {
          "X-API-KEY": key,
          Accept: "application/json",
          ...(payload !== undefined ? { "Content-Type": "application/json" } : {}),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`HTTP ${res.statusCode} ${res.statusMessage}\n${data}`));
            return;
          }
          if (!data) { resolve(null); return; }
          try { resolve(JSON.parse(data)); }
          catch { resolve(data); }
        });
      }
    );
    req.on("error", reject);
    if (payload !== undefined) req.write(payload);
    req.end();
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

const SECRET_KEY_RE = /(pass(word)?|secret|token|api[_-]?key|access[_-]?key|refresh[_-]?token|credential|client[_-]?secret|private[_-]?key|authorization|bearer|psk|wpa|passphrase)/i;

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

async function api(cfg, method, endpoint, body = undefined) {
  return redact(await request(cfg, method, endpoint, body));
}

function help() {
  console.log(`
UniFi Network Controller helper

Talks to the official, documented UniFi Network Integration API v1
(https://<console>/proxy/network/integration/v1/...). Endpoint list verified
against this console's own bundled docs (Settings -> Integrations, v10.5.67).

The API key is generated from your main admin account, so it carries full
read/write permission at the credential level. Every write command below is
listed in .claude/settings.json's "ask" tier, not "allow" -- nothing mutates
without an explicit per-call confirmation.

Usage:
  ./bin/unifi <command> [args]

Read -- inspection/connectivity:
  help
  info
  sites
  devices
  device <id>
  clients
  client <id>

Read -- network design (VLANs/WiFi/firewall):
  networks
  network <id>
  wifi-broadcasts               (WiFi networks / SSIDs)
  wifi-broadcast <id>
  firewall-zones
  firewall-zone <id>
  firewall-policies
  firewall-policy <id>
  acl-rules

Write -- client guest-access actions (the only client actions v1 exposes;
there is no block/unblock/forget/reconnect endpoint):
  client-authorize-guest <id> [timeLimitMinutes] [dataUsageLimitMBytes] [rxRateLimitKbps] [txRateLimitKbps]
  client-unauthorize-guest <id>

Write -- device actions:
  device-restart <id>

Escape hatch -- anything not covered by a named command above, notably
create/update/delete for networks (VLANs), wifi-broadcasts (WiFi networks),
firewall zones/policies, and ACL rules -- those have complex, multi-field
request bodies not worth hand-wrapping into narrow commands. Review the body
against the console's own docs before approving:
  raw <METHOD> <path> [json-body]

  Example: ./bin/unifi raw POST /sites/default/wifi/broadcasts '{"name":"Guest","enabled":true,...}'

Setup:
  ./bin/bootstrap-unifi
`);
}

async function main() {
  const [command = "help", ...args] = process.argv.slice(2);
  if (command === "help") return help();

  const cfg = readLocalConfig();
  const site = () => cfg.siteId;

  switch (command) {
    case "info":
      print(await api(cfg, "GET", "/info"));
      break;

    case "sites":
      print(await api(cfg, "GET", "/sites"));
      break;

    case "devices":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/devices`));
      break;

    case "device":
      if (!args[0]) die("device requires a device id.");
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/devices/${encodeURIComponent(args[0])}`));
      break;

    case "clients":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/clients`));
      break;

    case "client":
      if (!args[0]) die("client requires a client id.");
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/clients/${encodeURIComponent(args[0])}`));
      break;

    case "networks":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/networks`));
      break;

    case "network":
      if (!args[0]) die("network requires a network id.");
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/networks/${encodeURIComponent(args[0])}`));
      break;

    case "wifi-broadcasts":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/wifi/broadcasts`));
      break;

    case "wifi-broadcast":
      if (!args[0]) die("wifi-broadcast requires a WiFi broadcast id.");
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/wifi/broadcasts/${encodeURIComponent(args[0])}`));
      break;

    case "firewall-zones":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/firewall/zones`));
      break;

    case "firewall-zone":
      if (!args[0]) die("firewall-zone requires a firewall zone id.");
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/firewall/zones/${encodeURIComponent(args[0])}`));
      break;

    case "firewall-policies":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/firewall/policies`));
      break;

    case "firewall-policy":
      if (!args[0]) die("firewall-policy requires a firewall policy id.");
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/firewall/policies/${encodeURIComponent(args[0])}`));
      break;

    case "acl-rules":
      print(await api(cfg, "GET", `/sites/${encodeURIComponent(site())}/acl-rules`));
      break;

    // The only client actions the v1 API exposes are guest-access
    // authorize/unauthorize -- there is no block/unblock/forget/reconnect
    // endpoint, confirmed against the console's own bundled docs.
    case "client-authorize-guest": {
      const [id, timeLimitMinutes, dataUsageLimitMBytes, rxRateLimitKbps, txRateLimitKbps] = args;
      if (!id) die("client-authorize-guest requires a client id.");
      const body = { action: "AUTHORIZE_GUEST_ACCESS" };
      if (timeLimitMinutes) body.timeLimitMinutes = Number(timeLimitMinutes);
      if (dataUsageLimitMBytes) body.dataUsageLimitMBytes = Number(dataUsageLimitMBytes);
      if (rxRateLimitKbps) body.rxRateLimitKbps = Number(rxRateLimitKbps);
      if (txRateLimitKbps) body.txRateLimitKbps = Number(txRateLimitKbps);
      print(await api(cfg, "POST", `/sites/${encodeURIComponent(site())}/clients/${encodeURIComponent(id)}/actions`, body));
      break;
    }

    case "client-unauthorize-guest": {
      if (!args[0]) die("client-unauthorize-guest requires a client id.");
      print(await api(cfg, "POST", `/sites/${encodeURIComponent(site())}/clients/${encodeURIComponent(args[0])}/actions`, { action: "UNAUTHORIZE_GUEST_ACCESS" }));
      break;
    }

    case "device-restart": {
      if (!args[0]) die("device-restart requires a device id.");
      print(await api(cfg, "POST", `/sites/${encodeURIComponent(site())}/devices/${encodeURIComponent(args[0])}/actions`, { action: "RESTART" }));
      break;
    }

    case "raw": {
      const [method, endpoint, ...bodyParts] = args;
      if (!method || !endpoint) die("raw requires a METHOD and a path, e.g. raw GET /sites/default/devices");
      let body;
      if (bodyParts.length) {
        try { body = JSON.parse(bodyParts.join(" ")); }
        catch { die("raw's json-body argument must be valid JSON."); }
      }
      print(await api(cfg, method.toUpperCase(), endpoint, body));
      break;
    }

    default:
      die(`Unknown command: ${command}\nRun ./bin/unifi help`);
  }
}

main().catch((err) => die(err?.stack || String(err)));
