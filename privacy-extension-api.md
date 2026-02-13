# Privacy.com Chrome Extension — Complete API Reference

## Base URL

```
https://api.app.privacy.com
```

| Version | Base Path |
|---------|-----------|
| v1 | `https://api.app.privacy.com/api/v1/extension` |
| v2 | `https://api.app.privacy.com/api/v2/extension` |

---

## Important: Currency Values

API monetary values use **mixed formats**:

### Transaction Amounts — in Cents (no decimal, divide by 100)

| API Field | Example Raw Value | Actual USD |
|-----------|-------------------|------------|
| `amount` (transactions) | `295` | $2.95 |
| `acquiringAmount` | `1500` | $15.00 |
| `authorizationAmount` | `1500` | $15.00 |

### Card & User Fields — Already in Dollars

| API Field | Example Raw Value | Actual USD |
|-----------|-------------------|------------|
| `spendLimit` (cards) | `66` | $66.00 |
| `spentTotal` (cards) | `2.95` | $2.95 |
| `spentThisMonth` (cards) | `15.00` | $15.00 |
| `dailySpendLimit` (user) | `"1250.00"` | $1,250.00 (string) |
| `monthlySpendLimit` (user) | `"5000.00"` | $5,000.00 (string) |

**Rule of thumb**: Transaction `amount` fields are in **cents** (integer, no decimal — divide by 100). Card limits (`spendLimit`) and spend totals are already in **dollars**.

When setting `spendLimit` via the API, send the value in **dollars** (e.g., `50` for $50.00).

---

## Required Headers

Every request must include these headers to mimic the Chrome extension:

```
Content-Type: application/json
x-extension-id: djEuMC4x
x-extension-version: 2.4.15
sessionID: <uuid4>
Origin: chrome-extension://hmgpakheknboplhmlicfkkgjipfabmhp
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: cross-site
```

After login, add the auth header:

```
Authorization: Bearer <token>
```

For TFA device remembering (skip OTC next time):

```
x-tfa-deviceid: <deviceId>
```

### Header Notes

| Header | Value | Description |
|--------|-------|-------------|
| `x-extension-id` | `djEuMC4x` | Base64 encoding of `v1.0.1` |
| `x-extension-version` | `2.4.15` | Must match the installed extension version |
| `sessionID` | UUID v4 | Random UUID generated per session |
| `Origin` | `chrome-extension://hmgpakheknboplhmlicfkkgjipfabmhp` | Extension ID from Chrome Web Store |

---

## Login Flow (Step by Step)

### Step 1: Login Request

```
POST https://api.app.privacy.com/api/v2/extension/auth/login
```

**Body:**
```json
{
  "email": "your@email.com",
  "password": "your_password"
}
```

**Response (OTC challenge):**
```json
{
  "userToken": "eyJhbGciOiJIUzI1NiIs...",
  "oneTimeCode": true,
  "type": "email",
  "message": "A one-time code has been sent to your email. Please enter the code below."
}
```

Save the `userToken` for Step 2.

### Step 2: Submit One-Time Code

Check your email for the verification code, then:

```
POST https://api.app.privacy.com/api/v2/extension/auth/login/tfa
```

**Body:**
```json
{
  "code": "123456",
  "userToken": "<userToken from Step 1>",
  "rememberDevice": true
}
```

**Response (success):**
```json
{
  "id": "685dfe35628e5621ff328341",
  "emailConfirmed": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "deviceId": "eyJhbGciOiJIUzI1NiIs..."
}
```

- **`token`** — Use as `Authorization: Bearer <token>` for all subsequent requests
- **`deviceId`** — Save and send as `x-tfa-deviceid` header to skip OTC next login

### Full Login Example (Python)

```python
import json, urllib.request, ssl, uuid

BASE_HEADERS = {
    "Content-Type": "application/json",
    "x-extension-id": "djEuMC4x",
    "x-extension-version": "2.4.15",
    "sessionID": str(uuid.uuid4()),
    "Origin": "chrome-extension://hmgpakheknboplhmlicfkkgjipfabmhp",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
}

ctx = ssl.create_default_context()

# Step 1: Login
data = json.dumps({"email": "you@example.com", "password": "your_password"}).encode()
req = urllib.request.Request(
    "https://api.app.privacy.com/api/v2/extension/auth/login",
    data=data, headers=BASE_HEADERS, method="POST"
)
resp = urllib.request.urlopen(req, context=ctx)
login_result = json.loads(resp.read().decode())
user_token = login_result["userToken"]
print("Check your email for the OTC code...")

# Step 2: Submit OTC code
code = input("Enter OTC code: ")
data = json.dumps({
    "code": code,
    "userToken": user_token,
    "rememberDevice": True
}).encode()
req = urllib.request.Request(
    "https://api.app.privacy.com/api/v2/extension/auth/login/tfa",
    data=data, headers=BASE_HEADERS, method="POST"
)
resp = urllib.request.urlopen(req, context=ctx)
tfa_result = json.loads(resp.read().decode())

auth_token = tfa_result["token"]
device_id = tfa_result.get("deviceId", "")
print(f"Logged in! Token: {auth_token[:30]}...")

# Step 3: Use the token for any endpoint
BASE_HEADERS["Authorization"] = f"Bearer {auth_token}"
if device_id:
    BASE_HEADERS["x-tfa-deviceid"] = device_id
```

---

## Auth Endpoints (`/auth`)

| Method | Endpoint | Body | API | Tested |
|--------|----------|------|-----|--------|
| POST | `/auth/login` | `{ email, password }` | v2 | Yes |
| POST | `/auth/logout` | — | v2 | — |
| POST | `/auth/login/tfa` | `{ token: code, userToken, rememberDevice }` | v2 | Yes |
| POST | `/auth/login/tfa` (OTC) | `{ code, userToken, rememberDevice }` | v2 | Yes |
| POST | `/auth/send-verify-sms` | `{ userToken }` | v1 | — |
| POST | `/auth/tfa/reset` | `data` | v2 | — |
| POST | `/auth/tfa/resend` | `{ userToken }` | v2 | — |
| POST | `/auth/password-reset` | `{ email }` | v1 | — |
| POST | `/auth/token` | — (returns short-lived token) | v2 | Yes |

---

## Cards Endpoints (`/cards`)

| Method | Endpoint | Body/Params | API | Tested |
|--------|----------|-------------|-----|--------|
| GET | `/cards` | — | v2 | Yes (E2E) |
| POST | `/cards` | card creation data | v2 | Yes (E2E) |
| GET | `/cards/{cardUuid}` | `?fullInfo=true&spentThisMonth=true` | v2 | Yes (E2E) |
| PATCH | `/cards/{cardUuid}` | card update data | v2 | Yes (E2E) |
| PATCH | `/cards/{cardUuid}/state` | `{ "state": "..." }` | v2 | Yes (E2E) |
| PUT | `/cards/{cardUuid}/note` | note data | v2 | — |

> **Note**: `GET /cards` does **not** support a `?month=` query parameter. The API returns 400 if `month` is passed. Filter by month client-side using the `created` timestamp on each card.

### List Cards (`GET /cards`)

Returns all cards for the authenticated user.

**Response:**
```json
{
  "total": 42,
  "data": [
    {
      "cardUuid": "80f65bbd-...",
      "memo": "My Card",
      "state": "OPEN",
      "type": "MERCHANT_LOCKED",
      "spendLimit": 10000,
      "spendLimitDuration": "MONTHLY",
      "spentTotal": 2.95,
      "created": "2025-06-15T12:00:00Z"
    }
  ]
}
```

> **Confirmed via E2E**: Response is always a JSON object with `total` (int) and `data` (array), never a bare array.

### Create Card (`POST /cards`)

```json
{
  "type": "MERCHANT_LOCKED",
  "spendLimit": 10000,
  "spendLimitDuration": "MONTHLY",
  "bankAccountID": 2276353,
  "memo": "My Card Name",
  "merchantCategory": "664e5bd83078810a31188699",
  "meta": {
    "customStyle": {}
  }
}
```

**Card Types:**

| Type | Description |
|------|-------------|
| `MERCHANT_LOCKED` | Locked to first merchant that charges it |
| `UNLOCKED` | Can be used at any merchant |
| `PHYSICAL` | Physical card |
| `DIGITAL_WALLET` | Apple Pay / Google Pay |

### Update Card (`PATCH /cards/{cardUuid}`)

Send any combination of these fields:

```json
{
  "spendLimit": 5000,
  "spendLimitDuration": "MONTHLY",
  "bankAccountID": 2276353,
  "memo": "New Nickname"
}
```

**Spend Limit Durations:**

| Value | Description |
|-------|-------------|
| `TRANSACTION` | Per-transaction limit |
| `MONTHLY` | Monthly rolling limit |
| `ANNUALLY` | Annual rolling limit |
| `FOREVER` | Total lifetime limit |

### Change Card State (`PATCH /cards/{cardUuid}/state`)

```json
{
  "state": "PAUSED"
}
```

> **Confirmed via E2E**: OPEN → PAUSED → OPEN → CLOSED all work. Attempting to close an already-closed card returns 405.

**Valid States:**

| State | Description |
|-------|-------------|
| `OPEN` | Active, can be used |
| `PAUSED` | Temporarily frozen (resume by setting to `OPEN`) |
| `CLOSED` | Permanently closed (cannot reopen) |
| `CACHED` | Internal cache state |
| `CLOSED_PENDING_REISSUE` | Closed, pending replacement |
| `CLOSED_REISSUED` | Closed, replacement issued |
| `PRE_ACTIVE_PENDING_FULFILLMENT` | Physical card ordered |
| `PRE_ACTIVE_FULFILLED` | Physical card shipped |
| `LOST` | Reported lost |

### Set Card Note (`PUT /cards/{cardUuid}/note`)

```json
{
  "note": "This is my note text"
}
```

Separate from `memo` (nickname). The note is a freeform text field attached to the card.

---

## Transactions Endpoint (`/transactions`)

| Method | Endpoint | Params | API | Tested |
|--------|----------|--------|-----|--------|
| GET | `/transactions` | optional query params | v2 | Yes |

---

## Funding Endpoint (`/funding`)

| Method | Endpoint | Params | API | Tested |
|--------|----------|--------|-----|--------|
| GET | `/funding` | — | v2 | Yes |

---

## User Endpoints (`/user`)

| Method | Endpoint | Params | API | Tested |
|--------|----------|--------|-----|--------|
| GET | `/user/me` | — | v1 | Yes |
| GET | `/user/getAccountPhoto/{photoId}` | — | v1 (direct URL) | Yes |

The `photoId` comes from the `photo` field in the `GET /user/me` response.

---

## Event/Tracking Endpoints (`/event`)

| Method | Endpoint | Body | API | Tested |
|--------|----------|------|-----|--------|
| POST | `/event/track` | `{ event: { name, data } }` | v1 | — |
| POST | `/event/log` | `{ level, events, sessionId }` | v1 | — |
| POST | `/event/error` | `{ level, events, sessionId }` | v1 | — |

All tracking requires user consent (`activityConsentAgreed`). If not agreed, no events are sent.

### Track Events — When They Fire

#### Extension Lifecycle

| Event Name | Trigger |
|------------|---------|
| `Extension: Opened` | User clicks extension icon (popup opens) |
| `Extension: Dismissed` | User closes the popup |
| `Extension: Sign Up` | User completes account signup |

#### Consent Flow

| Event Name | Trigger |
|------------|---------|
| `Extension: Consent Shown` | Data consent dialog is displayed |
| `Extension: Consent Accepted` | User accepts data consent |
| `Extension: Consent Declined` | User declines consent (triggers uninstall) |
| `Extension: Consent Decline Cancelled` | User declines but browser blocks uninstall |

#### Checkout/Autofill

| Event Name | Trigger |
|------------|---------|
| `Extension: Checkout` | Checkout interstitial page opens |
| `Extension: Fill Checkout` | User clicks to autofill a card into a form — payload: `{ cardUuid, url }` |
| `Extension: Fill Checkout No Form Detected` | Autofill attempted but no payment form found — payload: `{ url }` |
| `Extension: Unable to Determine Input Field Format` | After fill, reports fields with unknown format |

#### Card Actions (tracked via `/event/track`)

| Event Name | Trigger |
|------------|---------|
| `Extension: Card Created` | New card created — payload: `{ cardType, spendLimit, spendLimitDuration }` |
| `Extension: Card Closed` | Card permanently closed |
| `Extension: Card Paused` | Card temporarily frozen |
| `Extension: Card Resumed` | Paused card reactivated |
| `Extension: Card Set Spend Limit` | Spend limit updated — payload: `{ cardUuid, spendLimit, spendLimitDuration }` |
| `Extension: Card Set Funding Source` | Funding source changed — payload: `{ cardUuid, bankAccountID }` |
| `Extension: Card Set Nickname` | Nickname updated — payload: `{ cardUuid, nickname }` |
| `Extension: Card Set Note` | Note updated |
| `Extension: Card PAN Copied` | User copies card number |
| `Extension: Card EXP Copied` | User copies expiry date |
| `Extension: Card CVV Copied` | User copies CVV |
| `Extension: Card Shared` | Card shared with someone |
| `Extension: Card Viewed` | Card details viewed |

#### Error Events (sent to `/event/error`)

| Event Name | Trigger |
|------------|---------|
| `Extension: Fill Checkout` (error) | Exception during autofill — payload: `{ cardUuid, url, error }` |

#### Defined But Never Used

| Event Name | Notes |
|------------|-------|
| `Extension: Account Redirect` | Defined in enum but no tracking call found |
| `Extension: Detected Checkout Form` | Defined in enum but no tracking call found |

---

## Other Endpoints

| Method | Endpoint | Description | API | Tested |
|--------|----------|-------------|-----|--------|
| GET | `/notifications` | Get notifications | v2 | Yes |
| GET | `/metric` | Get metrics | v1 | Yes |
| GET | `/subscriptions` | Get subscriptions | v2 | Yes |
| GET | `/merchantCategories` | Get merchant categories | v2 | Yes |
| GET | `/features/flags/{flag}` | Get feature flag value | v2 | Yes |

### Merchant Categories

Used when creating category cards via `POST /cards` with the `merchantCategory` field.

#### Primary Categories (9)

| Icon | Name | ID | Description |
|------|------|----|-------------|
| 🍔 | Dining | `664e5bd83078810a31188699` | Restaurants, bars, cocktail lounges, fast food, bakeries, etc. |
| 🎭 | Entertainment | `664e5bf13078816b3018869e` | Movie theaters, tourist attractions, ticket agencies, theatrical producers, etc. |
| 🥬 | Groceries | `664e5bf930788143241886a0` | Grocery stores, supermarkets, specialty markets, wholesale clubs, etc. |
| 🧬 | Health & Wellness | `664e5c01307881b1f71886a5` | Pharmacies, Physicians, Dentists, Opticians, Chiropractors, Therapy, Spas, etc. |
| 🦮 | Pets & Veterinary Services | `664e5c09307881a2111886aa` | Pet shops, pet foods, veterinaries, autoship, pet insurance, etc. |
| 🛍️ | Retail | `664e5c11307881b8d91886af` | Superstores, department stores, shoe stores, sports & apparel, clothing, etc. |
| 🎾 | Sports & Fitness | `664e5c193078816a531886b1` | Gym memberships, fitness subscriptions, country clubs, golf, tennis, etc. |
| 📱 | Subscriptions & Utilities | `664e5c223078815e621886b8` | Subscription services, cable, internet, electric, gas, water, etc. |
| 🏖️ | Travel & Transportation | `664e5c2b3078813dc51886ba` | Airlines, lodging, railways, car rentals, cruise lines, taxicabs, etc. |

#### Secondary Categories (7)

| Icon | Name | ID | Description |
|------|------|----|-------------|
| 🛞 | Automotive & Fuel | `664e5c3330788102db1886bc` | Dealers, automotive repair, towing, car washes, etc. |
| 🧼 | Cleaning, Repair & Maintenance | `664e5c3b30788170af1886be` | Dry cleaners, maid services, window cleaning, repair shops, etc. |
| 🎮 | Digital Goods | `664e5c4230788108f61886c0` | Books, movies, music, games, applications, etc. |
| 📚 | Education | `664e5c4e307881fcd61886c9` | Book stores, schools, educational services, etc. |
| 🏡 | Home & Construction | `664e5c57307881a9d41886cb` | Hardware stores, home furnishings, garden & lawn, etc. |
| 🎗️ | Nonprofit & Social Organizations | `664e5c613078816e371886cd` | Charities, political organizations, fraternities, associations, etc. |
| 💼 | Professional Services | `664e5c7a3078811c371886cf` | Insurance, real estate, counseling, accounting, legal services, etc. |

#### Create a Category Card Example

```json
POST /cards
{
  "type": "MERCHANT_LOCKED",
  "spendLimit": 66,
  "spendLimitDuration": "FOREVER",
  "merchantCategory": "664e5bd83078810a31188699",
  "memo": "Dining"
}
```

> **Note**: Category cards require the **Plus** plan ($5/mo) or higher. `UNLOCKED` cards require the **Pro** plan ($10/mo).

### Feature Flags

```
GET /features/flags/{flag}
```

Returns `{ "<flag>": true/false }`. Tested flags (all returned `false`):
`cashback`, `dark-mode`, `card-sharing`, `subscriptions`, `rewards`

---

## Summary

| | Count |
|---|---|
| **Total endpoints** | 28 |
| **GET** | 11 |
| **POST** | 11 |
| **PATCH** | 3 |
| **PUT** | 1 |
| **v1 API** | 7 |
| **v2 API** | 21 |
| **Tested & Working** | 19 |
| **Untested (write/destructive)** | 9 |

---

## Extension Security Analysis

### Permissions
- `storage` — Stores auth tokens, device ID, consent flags
- `tabs` — Sends messages to specific tabs
- `activeTab` — Interacts with current tab
- `cookies` — Sets short-lived auth cookies on `privacy.com`
- `<all_urls>` (content script) — Scans every page for payment forms
- `https://*.privacy.com/*` (host) — API communication
- `*://localhost/*` (host) — Development/debugging

### Verdict
Legitimate extension. No malicious behavior detected. All API calls go to official `api.app.privacy.com` domain only.

> **Note**: These are Privacy.com's private APIs. They require authentication with a valid Privacy.com account. Using them outside the extension may violate their Terms of Service.
