# Test Summary

**Author:** Ndifreke Edem  
**API:** [ReqRes](https://reqres.in)  
**Framework:** Playwright (JavaScript)  
**Repo:** [github.com/a-ndi/reqres-api-testing-project](https://github.com/a-ndi/reqres-api-testing-project)  
**Date:** August 14, 2026

I wrote 56 Playwright API tests against ReqRes. All passed in about 1.6s on the last run.

ReqRes started asking me to pay after my trial ended, but my free API key still worked, so I was able to finish and run the full suite without issues.

## Results

| | |
|--|--|
| Total | 56 |
| Passed | 56 |
| Failed | 0 |
| Time | ~1.6s |

**Suites**

- `tests/comprehensive/reqres-comprehensive.spec.js` — 50 tests (TC01–TC50)
- `tests/assignment/set-a-users.spec.js` — 3 tests
- `tests/assignment/set-b-crud.spec.js` — 3 tests (serial POST → PATCH → DELETE)

This covers pagination, user retrieval, invalid IDs, CRUD, login/register, schema checks, API key handling, payload edge cases, and a chained create-update-delete flow.

## How to run

```bash
cd "/Users/ndifrekeedem/Desktop/API Testing"
cp .env.example .env
npm install
npm test
```

Expected output: `56 passed`

**Report:** [Playwright test report](playwright-report/index.html) — open with `npm run report`

To zip for submission:

```bash
zip -r playwright-report.zip playwright-report/
```

## Test catalog (TC01–TC50)

### Pagination (TC01–TC08)

| ID | Endpoint | Expected |
|----|----------|----------|
| TC01 | GET `/api/users?page=1` | 200 |
| TC02 | GET `/api/users?page=2` | 200 |
| TC03 | GET `/api/users?page=1` | 6 users, `per_page=6` |
| TC04 | GET `/api/users?page=2` | 6 users, `page=2` |
| TC05 | GET page 1 vs page 2 | Different IDs; page 2 starts at 7 |
| TC06 | GET `/api/users?page=999` | 200, empty `data` |
| TC07 | GET `/api/users?page=0` | Defaults to page 1 |
| TC08 | GET `/api/users?page=1` | `total=12`, `total_pages=2` |

### Users (TC09–TC18)

| ID | Endpoint | Expected |
|----|----------|----------|
| TC09 | GET `/api/users/1` | 200 |
| TC10 | GET `/api/users/12` | 200 |
| TC11 | GET `/api/users/1` | Email `george.bluth@reqres.in` |
| TC12 | GET `/api/users/1` | User nested under `data` |
| TC13–TC18 | GET `/api/users/999`, `/23`, `/0`, `/abc`, `/-1`, `/13` | 404 |

### CRUD (TC19–TC23)

| ID | Endpoint | Expected |
|----|----------|----------|
| TC19 | POST `/api/users` | 201 |
| TC20 | POST `/api/users` | Name and job echoed back |
| TC21 | PUT `/api/users/2` | 200 |
| TC22 | PATCH `/api/users/2` | 200 |
| TC23 | DELETE `/api/users/2` | 204 |

### Auth (TC24–TC32)

| ID | Endpoint | Expected |
|----|----------|----------|
| TC24–TC25 | POST `/api/login`, `/api/register` | 200 |
| TC26–TC27 | Login/register responses | Token (and `id` for register) |
| TC28–TC32 | Missing fields, bad creds, unknown user | 400 |

Credentials come from `.env`, not hardcoded in the tests.

### Schema (TC33–TC40)

Checks user list fields, pagination metadata, POST response shape, Content-Type, avatar URL, token fields, and the `support` object on list responses.

### API key (TC41–TC43)

| ID | What | Expected |
|----|------|----------|
| TC41 | Valid key | 200 |
| TC42 | No key | 401, or 200 on legacy mode |
| TC43 | Bad key | 403, or 200 on legacy mode |

TC42 and TC43 use flexible assertions because ReqRes sometimes enforces the API key strictly and sometimes still returns 200 with `_meta.context: legacy_success`.

### Payloads (TC44–TC46)

Empty body, 500-char name, and special characters in name — all expect 201.

### Chaining (TC47–TC50, serial)

POST user → PATCH job → PUT name/job → DELETE. Each step uses the `id` from the previous one.

## Assignment tests

**Set A** — GET page 2 (200 + data array), POST user (201, echoed back), GET `/api/users/23` (404).

**Set B** — POST to create, PATCH to update job, DELETE (204). Runs in order.

## Notes

- Base URL is in `.env` (`API_BASE_URL=https://reqres.in`). Tests use relative paths like `/api/users?page=1`.
- API key is sent via a custom `api` fixture in `helpers/apiClient.js`, not hardcoded in config.
- `.env` is gitignored; only `.env.example` is in the repo.
