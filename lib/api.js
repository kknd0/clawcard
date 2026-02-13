import { randomUUID } from "node:crypto";
import * as config from "./config.js";

const BASE_V1 = "https://api.app.privacy.com/api/v1/extension";
const BASE_V2 = "https://api.app.privacy.com/api/v2/extension";

function headers(token) {
  const h = {
    "Content-Type": "application/json",
    "x-extension-id": "djEuMC4x",
    "x-extension-version": "2.4.15",
    sessionID: randomUUID(),
    Origin: "chrome-extension://hmgpakheknboplhmlicfkkgjipfabmhp",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "none",
  };
  if (token) h["Authorization"] = `Bearer ${token}`;
  const deviceId = config.getDeviceId();
  if (deviceId) h["x-tfa-deviceid"] = deviceId;
  return h;
}

async function request(method, url, body, token) {
  const opts = { method, headers: headers(token) };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);

  if (!res.ok) {
    const text = await res.text();
    let msg;
    try { msg = JSON.parse(text); } catch { msg = text; }
    console.error(
      `API error ${res.status}: ${typeof msg === "object" ? JSON.stringify(msg) : msg}`
    );
    process.exit(1);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}

export async function login(email, password) {
  return request("POST", `${BASE_V2}/auth/login`, { email, password });
}

export async function logout() {
  return request("POST", `${BASE_V2}/auth/logout`, null, config.getToken());
}

export async function submitOtc(code, userToken, remember = true) {
  return request("POST", `${BASE_V2}/auth/login/tfa`, {
    code,
    userToken,
    rememberDevice: remember,
  });
}

export async function listCards() {
  return request("GET", `${BASE_V2}/cards`, null, config.getToken());
}

export async function getCard(cardUuid) {
  return request(
    "GET",
    `${BASE_V2}/cards/${cardUuid}?fullInfo=true&spentThisMonth=true`,
    null,
    config.getToken()
  );
}

export async function createCard(
  cardType,
  spendLimit,
  spendLimitDuration,
  memo,
  bankAccountId,
  merchantCategory
) {
  const body = {
    type: cardType,
    spendLimit,
    spendLimitDuration,
    memo,
    meta: { customStyle: {} },
  };
  if (bankAccountId) body.bankAccountID = bankAccountId;
  if (merchantCategory) body.merchantCategory = merchantCategory;
  return request("POST", `${BASE_V2}/cards`, body, config.getToken());
}

export async function updateCard(cardUuid, fields) {
  return request("PATCH", `${BASE_V2}/cards/${cardUuid}`, fields, config.getToken());
}

export async function setCardState(cardUuid, state) {
  return request(
    "PATCH",
    `${BASE_V2}/cards/${cardUuid}/state`,
    { state },
    config.getToken()
  );
}
