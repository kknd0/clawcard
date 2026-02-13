import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as api from "../lib/api.js";
import * as config from "../lib/config.js";

const cfg = config.load();
const loggedIn = Boolean(cfg.token);

describe("E2E — real API calls", { skip: !loggedIn && "Not logged in" }, () => {
  it("full card lifecycle: create → get → update → freeze → unfreeze → close", async () => {
    let cardId;
    try {
      // 1. List (baseline)
      const cards = await api.listCards();
      assert.ok(typeof cards === "object");

      // 2. Create $1 burner
      const created = await api.createCard("MERCHANT_LOCKED", 1, "TRANSACTION", "E2E Test");
      cardId = created.cardUuid || created.id;
      assert.ok(cardId, `No card id in response: ${JSON.stringify(created)}`);

      // 3. Get — verify memo and state
      let card = await api.getCard(cardId);
      assert.equal(card.memo, "E2E Test");
      assert.equal(card.state, "OPEN");

      // 4. Update memo
      await api.updateCard(cardId, { memo: "E2E Renamed" });

      // 5. Verify update
      card = await api.getCard(cardId);
      assert.equal(card.memo, "E2E Renamed");

      // 6. Freeze
      await api.setCardState(cardId, "PAUSED");

      // 7. Verify frozen
      card = await api.getCard(cardId);
      assert.equal(card.state, "PAUSED");

      // 8. Unfreeze
      await api.setCardState(cardId, "OPEN");

      // 9. Verify open
      card = await api.getCard(cardId);
      assert.equal(card.state, "OPEN");

      // 10. Close
      await api.setCardState(cardId, "CLOSED");

      // 11. Verify closed
      card = await api.getCard(cardId);
      assert.equal(card.state, "CLOSED");
    } finally {
      if (cardId) {
        try { await api.setCardState(cardId, "CLOSED"); } catch {}
      }
    }
  });

  it("listCards returns object with data key", async () => {
    const result = await api.listCards();
    assert.ok(typeof result === "object");
    assert.ok("data" in result);
  });
});
