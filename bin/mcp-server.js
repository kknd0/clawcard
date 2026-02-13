#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as api from "../lib/api.js";
import * as config from "../lib/config.js";
import { CATEGORIES } from "../lib/format.js";

function checkLogin() {
  const cfg = config.load();
  if (!cfg.token) throw new Error("Not logged in. Run `clawcard login` in your terminal first.");
  return cfg.token;
}

function resolveCat(name) {
  if (!name) return null;
  const low = name.toLowerCase().trim();
  if (CATEGORIES[low]) return CATEGORIES[low];
  const match = Object.keys(CATEGORIES).find((k) => k.startsWith(low));
  if (match) return CATEGORIES[match];
  throw new Error(`Unknown category: ${name}. Available: ${Object.keys(CATEGORIES).sort().join(", ")}`);
}

const server = new McpServer({
  name: "ClawCard",
  version: "1.0.0",
});

server.tool(
  "login_status",
  "Check if ClawCard is logged in to Privacy.com",
  { reason: z.string().optional().describe("Brief explanation") },
  async () => {
    const cfg = config.load();
    return { content: [{ type: "text", text: cfg.token ? "Logged in." : "Not logged in. Run `clawcard login` in the terminal." }] };
  }
);

server.tool(
  "list_cards",
  "List all Privacy.com virtual cards",
  {
    state: z.enum(["OPEN", "PAUSED", "CLOSED"]).optional().describe("Filter by state"),
    month: z.string().optional().describe("Filter by creation month (YYYY-MM)"),
  },
  async ({ state, month }) => {
    checkLogin();
    let result = await api.listCards();
    let cards = Array.isArray(result) ? result : (result.data || result.cards || []);
    if (state) cards = cards.filter((c) => c.state === state);
    if (month) cards = cards.filter((c) => (c.created || "").startsWith(month));
    return { content: [{ type: "text", text: JSON.stringify(cards) }] };
  }
);

server.tool(
  "get_card",
  "Get full details for a specific card including PAN, expiry, and spending info",
  { card_id: z.string().describe("The card UUID") },
  async ({ card_id }) => {
    checkLogin();
    const card = await api.getCard(card_id);
    return { content: [{ type: "text", text: JSON.stringify(card) }] };
  }
);

server.tool(
  "create_burner",
  "Create a single-use burner card. Amount rounds up to next whole dollar.",
  {
    amount_dollars: z.number().describe("Payment amount in dollars"),
    merchant: z.string().describe("Merchant name"),
  },
  async ({ amount_dollars, merchant }) => {
    checkLogin();
    const limit = Math.ceil(amount_dollars);
    const card = await api.createCard("MERCHANT_LOCKED", limit, "TRANSACTION", merchant);
    return { content: [{ type: "text", text: JSON.stringify(card) }] };
  }
);

server.tool(
  "create_card",
  "Create a reusable card with a monthly spending limit",
  {
    name: z.string().describe("Card name"),
    limit_dollars: z.number().int().describe("Monthly spending limit in whole dollars"),
    category: z.string().optional().describe("Merchant category name"),
  },
  async ({ name, limit_dollars, category }) => {
    checkLogin();
    const catId = resolveCat(category);
    const card = await api.createCard("MERCHANT_LOCKED", limit_dollars, "MONTHLY", name, null, catId);
    return { content: [{ type: "text", text: JSON.stringify(card) }] };
  }
);

server.tool(
  "update_card",
  "Update an existing card's name, spending limit, or merchant category",
  {
    card_id: z.string().describe("The card UUID"),
    name: z.string().optional().describe("New card name"),
    limit_dollars: z.number().int().optional().describe("New monthly spending limit"),
    category: z.string().optional().describe("New merchant category name"),
  },
  async ({ card_id, name, limit_dollars, category }) => {
    checkLogin();
    const fields = {};
    if (name != null) fields.memo = name;
    if (limit_dollars != null) fields.spendLimit = limit_dollars;
    if (category != null) fields.merchantCategory = resolveCat(category);
    if (!Object.keys(fields).length) throw new Error("Nothing to update.");
    const card = await api.updateCard(card_id, fields);
    return { content: [{ type: "text", text: JSON.stringify(card) }] };
  }
);

server.tool(
  "freeze_card",
  "Freeze (pause) a card to prevent charges",
  { card_id: z.string().describe("The card UUID") },
  async ({ card_id }) => {
    checkLogin();
    await api.setCardState(card_id, "PAUSED");
    return { content: [{ type: "text", text: `Card ${card_id} frozen.` }] };
  }
);

server.tool(
  "unfreeze_card",
  "Unfreeze a paused card so it can accept charges again",
  { card_id: z.string().describe("The card UUID") },
  async ({ card_id }) => {
    checkLogin();
    await api.setCardState(card_id, "OPEN");
    return { content: [{ type: "text", text: `Card ${card_id} unfrozen and ready for payment.` }] };
  }
);

server.tool(
  "close_card",
  "Permanently close a card. This CANNOT be undone.",
  { card_id: z.string().describe("The card UUID") },
  async ({ card_id }) => {
    checkLogin();
    await api.setCardState(card_id, "CLOSED");
    return { content: [{ type: "text", text: `Card ${card_id} permanently closed.` }] };
  }
);

server.tool(
  "list_categories",
  "List all available merchant categories with their IDs",
  { reason: z.string().optional().describe("Brief explanation") },
  async () => {
    return { content: [{ type: "text", text: JSON.stringify(Object.fromEntries(Object.entries(CATEGORIES).sort())) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
