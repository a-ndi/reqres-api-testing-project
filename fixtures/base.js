const { test: base, expect } = require('@playwright/test');
const { ApiClient } = require('../helpers/apiClient');
const env = require('../config/env');

const test = base.extend({
  api: async ({ request }, use) => {
    const client = new ApiClient(request, env.apiKey);
    await use(client);
  },
});

module.exports = { test, expect };
