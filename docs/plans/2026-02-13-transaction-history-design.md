# Transaction History Feature Design

## Overview

Add transaction history to ClawCard — CLI command, MCP tool, and skill documentation.

## CLI Command

```
clawcard transactions [options]
```

### Options

| Flag | Example | Description |
|------|---------|-------------|
| `--card <id>` | `--card abc123` | Filter by card UUID (prefix match) |
| `--since <date>` | `--since 7d` / `--since 2025-01` | Date range filter |
| `--limit <n>` | `--limit 20` | Max results (default: 20) |
| `--status <s>` | `--status declined` | Filter by status (approved/declined/pending) |
| `--merchant <name>` | `--merchant amazon` | Fuzzy match merchant name |

### Terminal Output

```
  2025-01-15 14:32  Amazon.com          -$29.99   approved   Netflix Card [a1b2]
  2025-01-14 09:15  Spotify             -$9.99    approved   Spotify      [c3d4]
  2025-01-13 22:01  Unknown Merchant    -$5.00    declined   Burner       [e5f6]

  3 transaction(s)
```

Each row: datetime, merchant, amount (cents->dollars), colored status, card name, short card ID.

## Code Changes

| File | Change |
|------|--------|
| `lib/api.js` | Add `listTransactions(params)` — `GET /v2/extension/transactions` |
| `lib/format.js` | Add `formatCents(amount)` and `formatTxStatus(status)` |
| `lib/cli.js` | Add `cmdTransactions(opts)` — fetch + client-side filter + format |
| `bin/cli.js` | Register `transactions` command with all flags |
| `bin/mcp-server.js` | Add `list_transactions` tool with card/since/limit/status/merchant params |
| `skills/clawcard/SKILL.md` | Document `transactions` command |
| `test/cli.test.js` | Add `formatCents` / `formatTxStatus` unit tests |

## API Strategy

The `GET /v2/extension/transactions` endpoint accepts optional query params. Strategy:

1. Pass known server-side params (cardUuid, begin, end) to the API
2. Apply remaining filters (merchant, status, limit) client-side
3. If API rejects certain params, fall back to full fetch + client-side filtering

## Out of Scope

- No interactive pagination (--limit is sufficient)
- No JSON output mode
- No single-transaction detail view
- No CSV export
