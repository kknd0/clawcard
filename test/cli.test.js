import { describe, it, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  maskPan, formatDollars, formatState, resolveCategory, CATEGORIES,
} from "../lib/format.js";

// ---------------------------------------------------------------------------
// 1. Format Helpers
// ---------------------------------------------------------------------------

describe("maskPan", () => {
  it("masks 16-digit PAN", () => {
    assert.equal(maskPan("4242831012347291"), "4242 8310 \u2022\u2022\u2022\u2022 7291");
  });
  it("returns N/A for null", () => {
    assert.equal(maskPan(null), "N/A");
  });
  it("returns N/A for empty", () => {
    assert.equal(maskPan(""), "N/A");
  });
  it("returns short string as-is", () => {
    assert.equal(maskPan("1234"), "1234");
  });
});

describe("formatDollars", () => {
  it("formats integer", () => {
    assert.equal(formatDollars(25), "$25.00");
  });
  it("formats zero", () => {
    assert.equal(formatDollars(0), "$0.00");
  });
  it("returns No limit for null", () => {
    assert.equal(formatDollars(null), "No limit");
  });
  it("returns No limit for undefined", () => {
    assert.equal(formatDollars(undefined), "No limit");
  });
});

describe("formatState", () => {
  it("OPEN => active", () => {
    assert.ok(formatState("OPEN").includes("active"));
  });
  it("PAUSED => frozen", () => {
    assert.ok(formatState("PAUSED").includes("frozen"));
  });
  it("CLOSED => closed", () => {
    assert.ok(formatState("CLOSED").includes("closed"));
  });
  it("unknown => lowercase", () => {
    assert.equal(formatState("UNKNOWN"), "unknown");
  });
});

describe("resolveCategory", () => {
  it("exact match", () => {
    assert.equal(resolveCategory("dining"), CATEGORIES.dining);
  });
  it("prefix match", () => {
    assert.equal(resolveCategory("din"), CATEGORIES.dining);
  });
  it("case insensitive", () => {
    assert.equal(resolveCategory("DINING"), CATEGORIES.dining);
  });
  it("null returns null", () => {
    assert.equal(resolveCategory(null), null);
  });
  it("invalid exits", () => {
    const origExit = process.exit;
    let exitCode;
    process.exit = (code) => { exitCode = code; throw new Error("exit"); };
    try {
      resolveCategory("blahblah");
    } catch {}
    process.exit = origExit;
    assert.equal(exitCode, 1);
  });
});

// ---------------------------------------------------------------------------
// 2. Category Map
// ---------------------------------------------------------------------------

describe("CATEGORIES", () => {
  it("has 16 entries", () => {
    assert.equal(Object.keys(CATEGORIES).length, 16);
  });
  it("all values are MongoDB ObjectId strings", () => {
    for (const id of Object.values(CATEGORIES)) {
      assert.match(id, /^[0-9a-f]{24}$/);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. Math — ceil dollars
// ---------------------------------------------------------------------------

describe("ceil dollars (burner rounding)", () => {
  it("rounds up fractional", () => {
    assert.equal(Math.ceil(25.01), 26);
  });
  it("keeps exact dollar", () => {
    assert.equal(Math.ceil(25.0), 25);
  });
  it("rounds tiny amount", () => {
    assert.equal(Math.ceil(0.01), 1);
  });
});
