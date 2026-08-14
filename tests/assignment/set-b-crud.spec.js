const { test, expect } = require('../../fixtures/base');

test.describe('Set B Session 2 Mini Capstone', () => {
  test.describe.configure({ mode: 'serial' });

  let resourceId;

  test('Create a resource with POST and capture its ID', async ({ api }) => {
    const payload = {
      name: 'Ndifreke',
      job: 'QA Engineer',
    };

    const response = await api.post('/api/users', payload);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.id).toBeTruthy();

    resourceId = String(body.id);
  });

  test('Update it with PATCH and confirm the change', async ({ api }) => {
    const updatedJob = 'Senior QA Engineer';

    const response = await api.patch(`/api/users/${resourceId}`, { job: updatedJob });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.job).toBe(updatedJob);
  });

  test('Delete it and assert the correct success code', async ({ api }) => {
    const response = await api.delete(`/api/users/${resourceId}`);

    expect(response.status()).toBe(204);
  });
});
