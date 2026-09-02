import { it, describe, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

it('return health status', async () => {
  const response = await request(app).get('/api/health');
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ status: 'ok' });
});
