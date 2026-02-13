import { createInterface } from "node:readline/promises";
import * as api from "./api.js";
import * as config from "./config.js";
import {
  BOLD, DIM, CYAN, RESET, CATEGORIES,
  maskPan, formatDollars, formatState, formatCents, formatTxStatus,
  spinner, success, error, resolveCategory,
} from "./format.js";

// --- Input helpers ---

async function question(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(prompt);
  rl.close();
  return answer;
}

function readPassword(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    let input = "";
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const onData = (ch) => {
      if (ch === "\n" || ch === "\r" || ch === "\u0004") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onData);
        process.stdout.write("\n");
        resolve(input);
      } else if (ch === "\u0003") {
        process.exit();
      } else if (ch === "\u007f" || ch === "\b") {
        if (input.length > 0) input = input.slice(0, -1);
      } else {
        input += ch;
      }
    };
    process.stdin.on("data", onData);
  });
}

// --- Commands ---

export async function cmdLogin(opts) {
  const email = opts.email || (await question("Email: "));
  const password = await readPassword("Password: ");

  spinner("Authenticating...");
  let result = await api.login(email, password);

  if (result.oneTimeCode) {
    console.log(`Verification code sent via ${result.type || "email"}.`);
    const code = await question("Enter code: ");
    spinner("Verifying...");
    result = await api.submitOtc(code, result.userToken);
  }

  if (!result.token) {
    error("Login failed.");
    process.exit(1);
  }

  config.save({ token: result.token, device_id: result.deviceId });
  success("Logged in successfully.");
}

export async function cmdLogout() {
  try { await api.logout(); } catch {}
  config.save({});
  success("Logged out.");
}

export async function cmdBurner(amount, opts) {
  const limit = Math.ceil(parseFloat(amount));

  spinner("Creating burner card...");
  const result = await api.createCard(
    "MERCHANT_LOCKED", limit, "TRANSACTION", opts.merchant
  );

  const uuid = result.cardUuid || result.id || "";
  success("Burner Card Created");
  console.log(`  Number:   ${maskPan(result.pan)}`);
  console.log(`  CVC:      \u2022\u2022\u2022`);
  console.log(`  Merchant: ${opts.merchant}`);
  console.log(`  Limit:    $${limit.toFixed(2)}`);
  console.log(`  Type:     single use`);
  console.log(`  Status:   ${formatState("OPEN")}`);
  if (uuid) console.log(`  ID:       ${uuid}`);
  console.log(`\n${DIM}  If unused, run \`clawcard done ${uuid}\` to save it for later.${RESET}`);
}

export async function cmdUse(id) {
  spinner("Unfreezing card...");
  await api.setCardState(id, "OPEN");
  success("Card ready for payment.");
  console.log(`  ID:       ${id}`);
  console.log(`  Status:   ${formatState("OPEN")}`);
  console.log(`\n${DIM}  Run \`clawcard done ${id}\` after paying.${RESET}`);
}

export async function cmdDone(id, opts) {
  if (opts.fail) {
    spinner("Payment failed. Freezing card and cancelling limit...");
    await api.updateCard(id, { spendLimit: 0 });
    await api.setCardState(id, "PAUSED");
    success("Card frozen. Spending limit cancelled.");
  } else {
    spinner("Freezing card...");
    await api.setCardState(id, "PAUSED");
    success("Card frozen.");
  }
  console.log(`  ID:       ${id}`);
  console.log(`  Status:   ${formatState("PAUSED")}`);
}

export async function cmdCreate(opts) {
  const limitDollars = parseInt(opts.limit, 10);
  const catId = resolveCategory(opts.category);

  spinner("Creating reusable card...");
  const result = await api.createCard(
    "MERCHANT_LOCKED", limitDollars, "MONTHLY", opts.name, null, catId
  );

  const uuid = result.cardUuid || result.id || "";
  success("Reusable Card Created");
  console.log(`  Name:     ${opts.name}`);
  if (opts.category) console.log(`  Category: ${opts.category}`);
  console.log(`  Limit:    $${limitDollars.toFixed(2)}/monthly`);
  console.log(`  Status:   ${formatState("OPEN")}`);
  if (uuid) console.log(`  ID:       ${uuid}`);
  console.log(`\n${DIM}  Run \`clawcard done ${uuid}\` after each payment.${RESET}`);
}

export async function cmdList(opts) {
  spinner("Fetching cards...");
  let result = await api.listCards();
  let cards = Array.isArray(result) ? result : (result.data || result.cards || []);

  if (opts.month) {
    cards = cards.filter((c) => (c.created || "").startsWith(opts.month));
  }
  if (opts.state) {
    const target = { active: "OPEN", frozen: "PAUSED", closed: "CLOSED" }[
      opts.state.toLowerCase()
    ] || opts.state.toUpperCase();
    cards = cards.filter((c) => c.state === target);
  }

  if (!cards.length) {
    console.log("No cards found.");
    return;
  }

  console.log();
  for (const c of cards) {
    const state = c.state || "?";
    const memo = c.memo || "Unnamed";
    const limit = c.spendLimit;
    const duration = c.spendLimitDuration || "";
    const spent = c.spentTotal || 0;
    const shortId = (c.cardUuid || "").slice(0, 8) || "?";
    const isBurner = duration === "TRANSACTION";
    const kind = isBurner ? `${DIM}burner${RESET}` : `${CYAN}reusable${RESET}`;

    console.log(`  ${formatState(state).padStart(20)}  ${BOLD}${memo}${RESET}  ${kind}`);
    console.log(
      `            Limit: ${formatDollars(limit).padEnd(12)} Spent: $${String(spent).padEnd(10)} [${DIM}${shortId}${RESET}]`
    );
    console.log();
  }
  console.log(`${DIM}${cards.length} card(s)${RESET}`);
}

export async function cmdShow(id) {
  spinner("Fetching card details...");
  const card = await api.getCard(id);
  const duration = card.spendLimitDuration || "";
  const isBurner = duration === "TRANSACTION";

  console.log();
  success(card.memo || "Unnamed");
  console.log(`  Number:   ${maskPan(card.pan)}`);
  console.log(`  CVC:      \u2022\u2022\u2022`);
  console.log(`  Exp:      ${card.expMonth || "??"}/${card.expYear || "??"}`);
  console.log(`  Limit:    ${formatDollars(card.spendLimit)}`);
  console.log(`  Spent:    $${card.spentTotal || 0}`);
  console.log(`  Type:     ${isBurner ? "burner (single use)" : "reusable (monthly)"}`);
  console.log(`  Status:   ${formatState(card.state || "?")}`);
  console.log(`  ID:       ${card.cardUuid}`);
  if (card.note) console.log(`  Note:     ${card.note}`);
}

export async function cmdUpdate(id, opts) {
  const fields = {};
  if (opts.name != null) fields.memo = opts.name;
  if (opts.limit != null) fields.spendLimit = parseInt(opts.limit, 10);
  if (opts.category != null) fields.merchantCategory = resolveCategory(opts.category);

  if (!Object.keys(fields).length) {
    error("Nothing to update. Use --name, --limit, or --category.");
    process.exit(1);
  }

  spinner("Updating card...");
  await api.updateCard(id, fields);
  success("Card updated.");
  console.log(`  ID:       ${id}`);
  if (fields.memo) console.log(`  Name:     ${fields.memo}`);
  if (fields.spendLimit != null) console.log(`  Limit:    ${formatDollars(fields.spendLimit)}`);
  if (fields.merchantCategory) console.log(`  Category: ${opts.category}`);
}

export async function cmdClose(id) {
  const confirm = await question(`Permanently close card ${id}? This cannot be undone. [y/N] `);
  if (confirm.toLowerCase() !== "y") {
    console.log("Cancelled.");
    return;
  }
  spinner("Closing card...");
  await api.setCardState(id, "CLOSED");
  success("Card closed permanently.");
  console.log(`  ID:       ${id}`);
  console.log(`  Status:   ${formatState("CLOSED")}`);
}

export function cmdCategories() {
  console.log(`\n  ${"Category".padEnd(20)} ID`);
  console.log(`  ${"-".repeat(20)} ${"-".repeat(24)}`);
  for (const [name, id] of Object.entries(CATEGORIES).sort()) {
    console.log(`  ${name.padEnd(20)} ${DIM}${id}${RESET}`);
  }
  console.log();
}

function parseSince(since) {
  if (!since) return null;
  const m = since.match(/^(\d+)d$/);
  if (m) {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(m[1], 10));
    return d.toISOString();
  }
  const parsed = new Date(since);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();
  return null;
}

export async function cmdTransactions(opts) {
  spinner("Fetching transactions...");

  const params = {};
  if (opts.card) params.cardUuid = opts.card;
  const sinceISO = parseSince(opts.since);
  if (sinceISO) params.begin = sinceISO;

  let result = await api.listTransactions(params);
  let txns = Array.isArray(result) ? result : (result.data || result.transactions || []);

  if (opts.status) {
    const target = opts.status.toUpperCase();
    txns = txns.filter((t) => (t.statusDescription || "").toUpperCase() === target);
  }
  if (opts.merchant) {
    const q = opts.merchant.toLowerCase();
    txns = txns.filter((t) => (t.descriptor || "").toLowerCase().includes(q));
  }

  const limit = parseInt(opts.limit, 10) || 20;
  txns = txns.slice(0, limit);

  if (!txns.length) {
    console.log("No transactions found.");
    return;
  }

  console.log();
  for (const t of txns) {
    const date = (t.dateAuthorized || "").replace("T", " ").slice(0, 16);
    const merchant = t.descriptor || "Unknown";
    const amount = formatCents(t.amount);
    const status = formatTxStatus(t.statusDescription || "");
    const cardId = t.cardID || "?";
    const host = t.hostname || t.cardMeta?.hostname || "";

    console.log(`  ${DIM}${date}${RESET}  ${BOLD}${merchant.padEnd(24)}${RESET} -${amount.padEnd(10)} ${status.padEnd(20)} ${DIM}${host}${RESET} ${DIM}[${cardId}]${RESET}`);
  }
  console.log(`\n${DIM}${txns.length} transaction(s)${RESET}`);
}
