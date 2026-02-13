<p align="center">
  <img src="https://img.shields.io/badge/node-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node 18+">
  <img src="https://img.shields.io/badge/npx-clawcard-black?style=for-the-badge&logo=npm&logoColor=white" alt="npx clawcard">
  <img src="https://img.shields.io/badge/MCP-server-8A2BE2?style=for-the-badge" alt="MCP Server">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="License">
</p>

<h1 align="center">ClawCard</h1>

<p align="center">
  <strong>Virtual card management from the command line.</strong><br>
  Create, freeze, unfreeze, and close Privacy.com cards without leaving your terminal.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/clawcard">npm</a> &nbsp;&middot;&nbsp;
  <a href="https://github.com/kknd0/clawcard">GitHub</a> &nbsp;&middot;&nbsp;
  <a href="https://snap2fast.com/docs">Docs</a> &nbsp;&middot;&nbsp;
  <a href="https://skills.sh">Skill</a>
</p>

---

## Install

```bash
# Run directly — no install needed
npx clawcard

# Or install globally
npm install -g clawcard

# Add as Claude Code skill
npx skills add kknd0/clawcard

# Add MCP server to Claude Code
claude mcp add clawcard -- npx clawcard-mcp
```

---

## Quick Start

```bash
# Authenticate (email + one-time code)
clawcard login -e you@email.com

# One-time purchase — card auto-exhausts after use
clawcard burner 25.50 -m "amazon.com"

# Recurring service — create, pay, freeze, repeat
clawcard create -n "Spotify" -l 16 -c subscriptions
clawcard done <card-id>       # freeze after payment
clawcard use <card-id>        # unfreeze next month
```

---

## Why ClawCard?

Privacy.com lets you create virtual debit cards for online purchases. ClawCard wraps their internal API into a fast, scriptable CLI — no browser needed.

- **One command** to create a card, pay, and lock it down
- **`npx` ready** — run without installing
- **MCP server** included — use your cards from Claude Code or any MCP client
- **Claude Code skill** — install via [skills.sh](https://skills.sh)
- **Node.js 18+** — uses native `fetch`, minimal dependencies

---

## Card Types

### Burner Cards

Single-use cards for one-time purchases. Amount rounds up to the next whole dollar.

```bash
clawcard burner 49.99 -m "newegg.com"
```

```
Burner Card Created
  Number:   4242 8310 •••• 7291
  CVC:      •••
  Merchant: newegg.com
  Limit:    $50.00
  Type:     single use
  Status:   active
  ID:       a1b2c3d4-...
```

### Reusable Cards

For subscriptions and recurring payments. Set a monthly spending limit and optional merchant category.

```bash
clawcard create -n "Netflix" -l 23 -c entertainment
```

```
Reusable Card Created
  Name:     Netflix
  Category: entertainment
  Limit:    $23.00/monthly
  Status:   active
  ID:       a1b2c3d4-...
```

---

## Commands

| Command | Description |
|---------|-------------|
| `login [-e email]` | Authenticate with Privacy.com |
| `logout` | Clear saved credentials |
| `burner <amount> -m <merchant>` | Create a single-use card |
| `create -n <name> -l <limit> [-c <cat>]` | Create a reusable card |
| `use <id>` | Unfreeze a card for payment |
| `done <id> [--fail]` | Freeze after payment (`--fail` zeroes limit) |
| `list [--state active\|frozen\|closed] [--month YYYY-MM]` | List cards |
| `show <id>` | Show full card details |
| `update <id> [--name] [--limit] [--category]` | Update a card |
| `close <id>` | Permanently close a card |
| `categories` | List merchant categories |

---

## Workflows

```
ONE-TIME PURCHASE
  burner 25.50 -m "amazon.com"  ──▶  active  ──▶  payment  ──▶  exhausted

UNUSED BURNER ── SAVE FOR LATER
  burner 50 -m "store.com"      ──▶  active  ──▶  done <id>  ──▶  frozen
                                                   use <id>   ──▶  active

RECURRING PAYMENT
  create -n "Spotify" -l 16     ──▶  active  ──▶  payment
                                     done <id>  ──▶  frozen
                                     use <id>   ──▶  active  ──▶  payment
                                     done <id>  ──▶  frozen  ──▶  ...

PAYMENT FAILED
  done <id> --fail              ──▶  frozen + limit zeroed
```

**Card state machine:**

```
    ┌─────────┐     done      ┌─────────┐
    │  OPEN   │──────────────▶│ PAUSED  │
    │ (active)│◀──────────────│ (frozen)│
    └────┬────┘     use       └─────────┘
         │
         │ close
         ▼
    ┌─────────┐
    │ CLOSED  │  (permanent, cannot be undone)
    └─────────┘
```

---

## MCP Server

ClawCard includes a [Model Context Protocol](https://modelcontextprotocol.io/) server for AI-assisted card management.

### Setup

```bash
# Register with Claude Code
claude mcp add clawcard -- npx clawcard-mcp
```

### Available Tools

| Tool | Description |
|------|-------------|
| `login_status` | Check authentication state |
| `list_cards` | List all cards (filter by state/month) |
| `get_card` | Get full card details including PAN |
| `create_burner` | Create a single-use card |
| `create_card` | Create a reusable card with monthly limit |
| `update_card` | Update name, limit, or category |
| `freeze_card` | Pause a card |
| `unfreeze_card` | Resume a paused card |
| `close_card` | Permanently close a card |
| `list_categories` | List merchant categories |

---

## Project Structure

```
bin/
  cli.js               Entry point (#!/usr/bin/env node)
  mcp-server.js        MCP server (10 tools)
lib/
  api.js               Privacy.com API client (native fetch)
  cli.js               All commands + input helpers
  config.js            Token storage (~/.clawcard/config.json, 0600)
  format.js            Colors, categories, formatting helpers
skills/
  clawcard/SKILL.md    Claude Code skill (skills.sh)
test/
  cli.test.js          Unit tests (node:test)
  e2e.test.js          E2E tests (real API, skips if not logged in)
privacy-extension-api.md   Full API reference
```

## Testing

```bash
# Unit tests — no account needed
npm test

# E2E tests — requires login, creates a real $1 card and closes it
clawcard login
npm run test:e2e
```

E2E tests skip gracefully if not logged in.

---

## Currency Reference

| Field | Format | Example |
|-------|--------|---------|
| `spendLimit` | Dollars (integer) | `66` = $66.00 |
| `spentTotal` | Dollars (float) | `2.95` = $2.95 |
| Transaction `amount` | Cents (divide by 100) | `295` = $2.95 |

---

## Merchant Categories

```
automotive    cleaning      digital       dining
education     entertainment groceries     health
home          nonprofit     pets          professional
retail        sports        subscriptions travel
```

Use prefix matching: `-c din` matches `dining`, `-c ent` matches `entertainment`.

---

## Security

- Credentials stored at `~/.clawcard/config.json` with `0600` permissions
- Directory permissions set to `0700`
- No tokens in environment variables, command history, or logs
- Auth uses Privacy.com's email + one-time-code flow

## Requirements

- Node.js 18+
- Dependencies: `commander`, `@modelcontextprotocol/sdk`, `zod`

## License

MIT
