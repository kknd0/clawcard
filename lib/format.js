const isTTY = process.stdout.isTTY;

export const BOLD  = isTTY ? "\x1b[1m" : "";
export const DIM   = isTTY ? "\x1b[2m" : "";
export const GREEN = isTTY ? "\x1b[32m" : "";
export const YELLOW= isTTY ? "\x1b[33m" : "";
export const RED   = isTTY ? "\x1b[31m" : "";
export const CYAN  = isTTY ? "\x1b[36m" : "";
export const RESET = isTTY ? "\x1b[0m" : "";

export const CATEGORIES = {
  dining:         "664e5bd83078810a31188699",
  entertainment:  "664e5bf13078816b3018869e",
  groceries:      "664e5bf930788143241886a0",
  health:         "664e5c01307881b1f71886a5",
  pets:           "664e5c09307881a2111886aa",
  retail:         "664e5c11307881b8d91886af",
  sports:         "664e5c193078816a531886b1",
  subscriptions:  "664e5c223078815e621886b8",
  travel:         "664e5c2b3078813dc51886ba",
  automotive:     "664e5c3330788102db1886bc",
  cleaning:       "664e5c3b30788170af1886be",
  digital:        "664e5c4230788108f61886c0",
  education:      "664e5c4e307881fcd61886c9",
  home:           "664e5c57307881a9d41886cb",
  nonprofit:      "664e5c613078816e371886cd",
  professional:   "664e5c7a3078811c371886cf",
};

export function maskPan(pan) {
  if (!pan || pan.length < 8) return pan || "N/A";
  const clean = pan.replace(/ /g, "");
  return `${clean.slice(0, 4)} ${clean.slice(4, 8)} \u2022\u2022\u2022\u2022 ${clean.slice(-4)}`;
}

export function formatDollars(amount) {
  if (amount == null) return "No limit";
  return `$${Number(amount).toFixed(2)}`;
}

export function formatState(state) {
  const map = {
    OPEN:   `${GREEN}active${RESET}`,
    PAUSED: `${YELLOW}frozen${RESET}`,
    CLOSED: `${RED}closed${RESET}`,
  };
  return map[state] || state.toLowerCase();
}

export function spinner(msg) { console.log(`${DIM}${msg}${RESET}`); }
export function success(msg) { console.log(`${GREEN}${BOLD}${msg}${RESET}`); }
export function error(msg)   { console.error(`${RED}${msg}${RESET}`); }

export function formatCents(cents) {
  if (cents == null) return "$0.00";
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

export function formatTxStatus(status) {
  const s = (status || "").toUpperCase();
  const map = {
    SETTLED:    `${GREEN}settled${RESET}`,
    AUTHORIZED: `${CYAN}authorized${RESET}`,
    VOIDED:     `${DIM}voided${RESET}`,
    DECLINED:   `${RED}declined${RESET}`,
    PENDING:    `${YELLOW}pending${RESET}`,
  };
  return map[s] || s.toLowerCase();
}

export function resolveCategory(name) {
  if (!name) return null;
  const low = name.toLowerCase().trim();
  if (CATEGORIES[low]) return CATEGORIES[low];
  const match = Object.keys(CATEGORIES).find((k) => k.startsWith(low));
  if (match) return CATEGORIES[match];
  error(`Unknown category: ${name}`);
  console.log("\n  Available categories:");
  Object.keys(CATEGORIES).sort().forEach((c) => console.log(`    - ${c}`));
  console.log();
  process.exit(1);
}
