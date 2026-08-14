const { test, expect } = require('../../fixtures/base');

test.describe('Testars Assignment Set A', () => {
  test('1. GET /users?page=2 assert 200 and a data array', async ({ api }) => {
    const response = await api.get('/api/users?page=2');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('2. POST a user with your own name/job assert it is echoed back', async ({ api }) => {
    const payload = {
      name: 'Ndifreke',
      job: 'QA Engineer',
    };

    const response = await api.post('/api/users', payload);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
  });

  test('3. GET a non-existent user assert the actual status you get', async ({ api }) => {
    const response = await api.get('/api/users/23');

    expect(response.status()).toBe(404);
  });
});
