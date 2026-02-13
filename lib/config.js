import { existsSync, readFileSync, chmodSync, mkdirSync } from "node:fs";
import { writeFileSync, openSync, closeSync, writeSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const CONFIG_DIR = join(homedir(), ".clawcard");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

function ensureDir() {
  mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
}

export function load() {
  if (!existsSync(CONFIG_FILE)) return {};
  return JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
}

export function save(data) {
  ensureDir();
  const fd = openSync(CONFIG_FILE, "w", 0o600);
  writeSync(fd, JSON.stringify(data, null, 2));
  closeSync(fd);
}

export function getToken() {
  const cfg = load();
  if (cfg.token) return cfg.token;
  console.error("Not logged in. Run: clawcard login");
  process.exit(1);
}

export function getDeviceId() {
  return load().device_id || null;
}
