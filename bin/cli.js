#!/usr/bin/env node
import { Command } from "commander";
import {
  cmdLogin, cmdLogout, cmdBurner, cmdUse, cmdDone,
  cmdCreate, cmdList, cmdShow, cmdUpdate, cmdClose, cmdCategories,
} from "../lib/cli.js";

const program = new Command()
  .name("clawcard")
  .description("ClawCard \u2014 Virtual card management from the command line")
  .version("1.0.0");

program
  .command("login")
  .description("Authenticate with your account")
  .option("-e, --email <email>", "Account email")
  .action(cmdLogin);

program
  .command("logout")
  .description("Log out and clear saved token")
  .action(cmdLogout);

program
  .command("burner <amount>")
  .description("Create a single-use burner card")
  .requiredOption("-m, --merchant <name>", "Merchant name")
  .action(cmdBurner);

program
  .command("use <id>")
  .description("Unfreeze a card for payment")
  .action(cmdUse);

program
  .command("done <id>")
  .description("Freeze card after payment")
  .option("-f, --fail", "Payment failed \u2014 freeze and cancel spending limit")
  .action(cmdDone);

program
  .command("create")
  .description("Create a reusable card (starts active)")
  .requiredOption("-n, --name <name>", "Card name")
  .requiredOption("-l, --limit <dollars>", "Monthly spending limit in whole dollars")
  .option("-c, --category <name>", "Merchant category")
  .action(cmdCreate);

program
  .command("list")
  .alias("ls")
  .description("List all cards")
  .option("--month <YYYY-MM>", "Filter by creation month")
  .option("-s, --state <state>", "Filter by state (active, frozen, closed)")
  .action(cmdList);

program
  .command("show <id>")
  .description("Show card details")
  .action(cmdShow);

program
  .command("update <id>")
  .description("Update a card")
  .option("-n, --name <name>", "New card name")
  .option("-l, --limit <dollars>", "New spending limit in whole dollars")
  .option("-c, --category <name>", "New merchant category")
  .action(cmdUpdate);

program
  .command("close <id>")
  .description("Permanently close a card")
  .action(cmdClose);

program
  .command("categories")
  .alias("cat")
  .description("List merchant categories")
  .action(cmdCategories);

program.parse();
