const { test, expect } = require('../../fixtures/base');
const env = require('../../config/env');
const {
  expectMissingApiKeyResponse,
  expectInvalidApiKeyResponse,
} = require('../../helpers/authExpectations');

test.describe('ReqRes API Tests', () => {
  test.describe('Pagination', () => {
    test('TC01 GET /api/users?page=1 returns 200', async ({ api }) => {
      const response = await api.get('/api/users?page=1');
      expect(response.status()).toBe(200);
    });

    test('TC02 GET /api/users?page=2 returns 200', async ({ api }) => {
      const response = await api.get('/api/users?page=2');
      expect(response.status()).toBe(200);
    });

    test('TC03 page 1 returns 6 users', async ({ api }) => {
      const body = await (await api.get('/api/users?page=1')).json();
      expect(body.data).toHaveLength(6);
      expect(body.per_page).toBe(6);
    });

    test('TC04 page 2 returns remaining users', async ({ api }) => {
      const body = await (await api.get('/api/users?page=2')).json();
      expect(body.data).toHaveLength(6);
      expect(body.page).toBe(2);
    });

    test('TC05 page 1 and page 2 have different user IDs', async ({ api }) => {
      const page1 = await (await api.get('/api/users?page=1')).json();
      const page2 = await (await api.get('/api/users?page=2')).json();
      const page1Ids = page1.data.map((user) => user.id);
      const page2Ids = page2.data.map((user) => user.id);
      expect(page1Ids).not.toEqual(page2Ids);
      expect(page2Ids[0]).toBe(7);
    });

    test('TC06 page=999 returns empty data array', async ({ api }) => {
      const response = await api.get('/api/users?page=999');
      const body = await response.json();
      expect(response.status()).toBe(200);
      expect(body.data).toEqual([]);
      expect(body.page).toBe(999);
    });

    test('TC07 page=0 defaults to page 1', async ({ api }) => {
      const body = await (await api.get('/api/users?page=0')).json();
      expect(body.page).toBe(1);
      expect(body.data.length).toBeGreaterThan(0);
    });

    test('TC08 total_pages is 2 for 12 users', async ({ api }) => {
      const body = await (await api.get('/api/users?page=1')).json();
      expect(body.total).toBe(12);
      expect(body.total_pages).toBe(2);
    });
  });

  test.describe('Users', () => {
    test('TC09 GET /api/users/1 returns 200', async ({ api }) => {
      const response = await api.get('/api/users/1');
      expect(response.status()).toBe(200);
    });

    test('TC10 GET /api/users/12 returns 200', async ({ api }) => {
      const response = await api.get('/api/users/12');
      expect(response.status()).toBe(200);
    });

    test('TC11 GET /api/users/1 returns expected email', async ({ api }) => {
      const body = await (await api.get('/api/users/1')).json();
      expect(body.data.email).toBe('george.bluth@reqres.in');
    });

    test('TC12 single user response is nested under data', async ({ api }) => {
      const body = await (await api.get('/api/users/1')).json();
      expect(body.data).toMatchObject({
        id: 1,
        first_name: expect.any(String),
        last_name: expect.any(String),
      });
    });
  });

  test.describe('Users Invalid IDs', () => {
    test('TC13 GET /api/users/999 returns 404', async ({ api }) => {
      expect((await api.get('/api/users/999')).status()).toBe(404);
    });

    test('TC14 GET /api/users/23 returns 404', async ({ api }) => {
      expect((await api.get('/api/users/23')).status()).toBe(404);
    });

    test('TC15 GET /api/users/0 returns 404', async ({ api }) => {
      expect((await api.get('/api/users/0')).status()).toBe(404);
    });

    test('TC16 GET /api/users/abc returns 404', async ({ api }) => {
      expect((await api.get('/api/users/abc')).status()).toBe(404);
    });

    test('TC17 GET /api/users/-1 returns 404', async ({ api }) => {
      expect((await api.get('/api/users/-1')).status()).toBe(404);
    });

    test('TC18 GET /api/users/13 returns 404', async ({ api }) => {
      expect((await api.get('/api/users/13')).status()).toBe(404);
    });
  });

  test.describe('CRUD', () => {
    test('TC19 POST /api/users returns 201', async ({ api }) => {
      const response = await api.post('/api/users', { name: 'Ndifreke', job: 'QA Engineer' });
      expect(response.status()).toBe(201);
    });

    test('TC20 POST echoes name and job', async ({ api }) => {
      const payload = { name: 'Ndifreke', job: 'QA Engineer' };
      const body = await (await api.post('/api/users', payload)).json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
    });

    test('TC21 PUT /api/users/2 returns 200', async ({ api }) => {
      const response = await api.put('/api/users/2', { name: 'Janet', job: 'Developer' });
      expect(response.status()).toBe(200);
    });

    test('TC22 PATCH /api/users/2 returns 200', async ({ api }) => {
      const response = await api.patch('/api/users/2', { job: 'Senior QA Engineer' });
      expect(response.status()).toBe(200);
    });

    test('TC23 DELETE /api/users/2 returns 204', async ({ api }) => {
      const response = await api.delete('/api/users/2');
      expect(response.status()).toBe(204);
    });
  });

  test.describe('Auth', () => {
    test.beforeAll(() => {
      if (!env.login.email || !env.login.password || !env.register.email || !env.register.password) {
        throw new Error('Missing auth credentials in .env');
      }
    });

    test('TC24 POST /api/login returns 200', async ({ api }) => {
      const response = await api.post('/api/login', env.login);
      expect(response.status()).toBe(200);
    });

    test('TC25 POST /api/register returns 200', async ({ api }) => {
      const response = await api.post('/api/register', env.register);
      expect(response.status()).toBe(200);
    });

    test('TC26 login response includes token', async ({ api }) => {
      const body = await (await api.post('/api/login', env.login)).json();
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });

    test('TC27 register response includes id and token', async ({ api }) => {
      const body = await (await api.post('/api/register', env.register)).json();
      expect(body.id).toBeTruthy();
      expect(typeof body.token).toBe('string');
    });
  });

  test.describe('Auth Errors', () => {
    test.beforeAll(() => {
      if (!env.login.email || !env.login.password || !env.register.email) {
        throw new Error('Missing auth credentials in .env');
      }
    });

    test('TC28 login without password returns 400', async ({ api }) => {
      const response = await api.post('/api/login', { email: env.login.email });
      expect(response.status()).toBe(400);
    });

    test('TC29 login without email returns 400', async ({ api }) => {
      const response = await api.post('/api/login', { password: env.login.password });
      expect(response.status()).toBe(400);
    });

    test('TC30 login with bad credentials returns 400', async ({ api }) => {
      const response = await api.post('/api/login', {
        email: 'unknown@reqres.in',
        password: 'wrongpassword',
      });
      expect(response.status()).toBe(400);
    });

    test('TC31 register without password returns 400', async ({ api }) => {
      const response = await api.post('/api/register', { email: env.register.email });
      expect(response.status()).toBe(400);
    });

    test('TC32 register unknown email returns 400', async ({ api }) => {
      const response = await api.post('/api/register', {
        email: 'not-a-real-user@example.com',
        password: 'wrongpassword',
      });
      expect(response.status()).toBe(400);
    });
  });

  test.describe('Schema', () => {
    test('TC33 user list items have required fields', async ({ api }) => {
      const body = await (await api.get('/api/users?page=1')).json();
      expect(body.data[0]).toMatchObject({
        id: expect.any(Number),
        email: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
        avatar: expect.any(String),
      });
    });

    test('TC34 paginated response has metadata fields', async ({ api }) => {
      const body = await (await api.get('/api/users?page=1')).json();
      expect(body).toMatchObject({
        page: expect.any(Number),
        per_page: expect.any(Number),
        total: expect.any(Number),
        total_pages: expect.any(Number),
        data: expect.any(Array),
      });
    });

    test('TC35 POST user response includes id and createdAt', async ({ api }) => {
      const body = await (await api.post('/api/users', { name: 'Schema', job: 'Test' })).json();
      expect(body.id).toBeTruthy();
      expect(body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    test('TC36 response Content-Type is application/json', async ({ api }) => {
      const response = await api.get('/api/users?page=1');
      expect(response.headers()['content-type']).toContain('application/json');
    });

    test('TC37 user avatar is a valid URL', async ({ api }) => {
      const body = await (await api.get('/api/users/1')).json();
      expect(body.data.avatar).toMatch(/^https?:\/\/.+/);
    });

    test('TC38 login response has token field', async ({ api }) => {
      const body = await (await api.post('/api/login', env.login)).json();
      expect(body).toHaveProperty('token');
    });

    test('TC39 register response has token field', async ({ api }) => {
      const body = await (await api.post('/api/register', env.register)).json();
      expect(body).toHaveProperty('token');
    });

    test('TC40 user list includes support object', async ({ api }) => {
      const body = await (await api.get('/api/users?page=1')).json();
      expect(body.support).toMatchObject({
        url: expect.any(String),
        text: expect.any(String),
      });
    });
  });

  test.describe('API Key', () => {
    test('TC41 valid API key returns 200', async ({ api }) => {
      const response = await api.get('/api/users?page=1');
      expect(response.status()).toBe(200);
    });

    test('TC42 missing API key returns 401', async ({ request }) => {
      const response = await request.get('/api/users?page=1');
      await expectMissingApiKeyResponse(response);
    });

    test('TC43 invalid API key returns 403', async ({ request }) => {
      const response = await request.get('/api/users?page=1', {
        headers: { 'x-api-key': 'invalid_key_for_testing' },
      });
      await expectInvalidApiKeyResponse(response);
    });
  });

  test.describe('Payloads', () => {
    test('TC44 POST empty body returns 201', async ({ api }) => {
      const response = await api.post('/api/users', {});
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.id).toBeTruthy();
    });

    test('TC45 POST long name returns 201', async ({ api }) => {
      const longName = 'A'.repeat(500);
      const response = await api.post('/api/users', { name: longName, job: 'QA' });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.name).toBe(longName);
    });

    test('TC46 POST special characters in name returns 201', async ({ api }) => {
      const name = "O'Brien <test> & Co.";
      const response = await api.post('/api/users', { name, job: 'QA' });
      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.name).toBe(name);
    });
  });

  test.describe('Chaining', () => {
    test.describe.configure({ mode: 'serial' });

    let resourceId;

    test('TC47 POST user and save id', async ({ api }) => {
      const response = await api.post('/api/users', { name: 'Chain User', job: 'Junior QA' });
      expect(response.status()).toBe(201);
      const body = await response.json();
      resourceId = String(body.id);
      expect(resourceId).toBeTruthy();
    });

    test('TC48 PATCH user job', async ({ api }) => {
      const updatedJob = 'Mid QA Engineer';
      const response = await api.patch(`/api/users/${resourceId}`, { job: updatedJob });
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.job).toBe(updatedJob);
    });

    test('TC49 PUT user name and job', async ({ api }) => {
      const payload = { name: 'Updated Chain User', job: 'Senior QA Engineer' };
      const response = await api.put(`/api/users/${resourceId}`, payload);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
    });

    test('TC50 DELETE user returns 204', async ({ api }) => {
      const response = await api.delete(`/api/users/${resourceId}`);
      expect(response.status()).toBe(204);
    });
  });
});
