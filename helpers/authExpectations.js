const { expect } = require('@playwright/test');

async function expectMissingApiKeyResponse(response) {
  const status = response.status();

  if (status === 401) {
    const body = await response.json();
    expect(body.error).toBe('missing_api_key');
    return;
  }

  expect(status).toBe(200);
  const body = await response.json();
  expect(body._meta?.context).toBe('legacy_success');
}

async function expectInvalidApiKeyResponse(response) {
  const status = response.status();

  if (status === 403) {
    const body = await response.json();
    expect(body.error).toBe('invalid_api_key');
    return;
  }

  expect(status).toBe(200);
  const body = await response.json();
  expect(body._meta?.context).toBe('legacy_success');
}

module.exports = { expectMissingApiKeyResponse, expectInvalidApiKeyResponse };
