# ReqRes API Testing Project

Playwright API test suite for [ReqRes](https://reqres.in), built with JavaScript and Playwright's `request` fixture. No browser required.

## Overview

This project automates HTTP API tests against ReqRes endpoints covering:

- User list and pagination
- Single user retrieval (valid and invalid IDs)
- Create, update (PUT/PATCH), and delete users
- Login and registration (valid and invalid)
- API chaining workflow (POST → PATCH → PUT → DELETE)
- Negative, boundary, validation, schema, and authentication scenarios

**Test counts**

| Suite | File | Tests |
|-------|------|-------|
| Comprehensive | `tests/comprehensive/reqres-comprehensive.spec.js` | 50 |
| Assignment Set A | `tests/assignment/set-a-users.spec.js` | 3 |
| Assignment Set B | `tests/assignment/set-b-crud.spec.js` | 3 |

## Project structure

```
├── config/env.js              # Loads environment variables
├── fixtures/base.js           # Custom Playwright fixture with api client
├── helpers/
│   ├── apiClient.js           # Wrapper around Playwright request
│   └── authExpectations.js    # API key auth assertions
├── tests/
│   ├── comprehensive/         # 50 test cases (TC01–TC50)
│   └── assignment/            # Set A and Set B assignment specs
├── playwright.config.js       # Base URL and Playwright config
├── .env.example               # Environment variable template
└── .gitignore                 # Excludes .env and reports
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm
- A free ReqRes API key from [app.reqres.in/api-keys](https://app.reqres.in/api-keys)

## Setup

1. Clone the repository:

```bash
git clone git@github.com:a-ndi/reqres-api-testing-project.git
cd reqres-api-testing-project
```

2. Install dependencies:

```bash
npm install
```

3. Create your local environment file:

```bash
cp .env.example .env
```

4. Edit `.env` with your values:

```env
API_BASE_URL=https://reqres.in
REQRES_API_KEY=your-key-here
REQRES_LOGIN_EMAIL=eve.holt@reqres.in
REQRES_LOGIN_PASSWORD=cityslicka
REQRES_REGISTER_EMAIL=eve.holt@reqres.in
REQRES_REGISTER_PASSWORD=pistol
```

> **Important:** Never commit `.env`. It is gitignored. I added `.env.example` to show people how to structure.

## Running tests

```bash
# Run all tests (56 total)
npm test

# Run comprehensive suite only (50 tests)
npm run test:comprehensive

# Run assignment tests only (6 tests)
npm run test:assignment

# Run with Playwright UI
npm run test:ui

# View HTML report after a test run
npm run report
```

Run a single file:

```bash
npx playwright test tests/comprehensive/reqres-comprehensive.spec.js
npx playwright test tests/assignment/set-a-users.spec.js
```

## Test categories (comprehensive suite)

| Category | Describe block | Examples |
|----------|----------------|----------|
| Pagination | `Pagination` | TC01–TC08 |
| Positive retrieval | `Users` | TC09–TC12 |
| Negative / boundary IDs | `Users Invalid IDs` | TC13–TC18 |
| CRUD | `CRUD` | TC19–TC23 |
| Auth | `Auth` | TC24–TC27 |
| Auth errors | `Auth Errors` | TC28–TC32 |
| Schema | `Schema` | TC33–TC40 |
| API key | `API Key` | TC41–TC43 |
| Payload edge cases | `Payloads` | TC44–TC46 |
| Chaining | `Chaining` | TC47–TC50 |

## How it works

- **Base URL** is configured in `.env` and applied via `playwright.config.js`
- Tests use **relative paths** (e.g. `/api/users?page=1`), not hardcoded URLs
- The `api` fixture wraps Playwright's `APIRequestContext` and attaches the API key header
- Login and register credentials are loaded from `.env`, not hardcoded in test files

## Reports

After running tests, an HTML report is generated in `playwright-report/`. Open it with:

```bash
npm run report
```

## Author

Ndifreke Edem - [GitHub](https://github.com/a-ndi)
