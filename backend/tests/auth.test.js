import { it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

//check register user
it('registers a new user', async () => {
  const response = await request(app).post('/api/auth/register').send({
    email: 'test@example.com',
    password: 'password123',
  });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.user.email).toBe('test@example.com');
});

//check duplicate email
it('rejects duplicate email', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'duplicate@example.com',
    password: 'password123',
  });
  const response = await request(app).post('/api/auth/register').send({
    email: 'duplicate@example.com',
    password: 'password123',
  });
  expect(response.status).toBe(409);
  expect(response.body.message).toBe('Email already exists');
});

//login user
it('logs in an existing user', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'user1@example.com',
    password: 'password123',
  });
  const response = await request(app).post('/api/auth/login').send({
    email: 'user1@example.com',
    password: 'password123',
  });
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.token).toBeDefined();
  expect(response.body.user.email).toBe('user1@example.com');
});

//check login details
it('rejects incorrect password', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'wrongpass@example.com',
    password: 'password123',
  });

  const response = await request(app).post('/api/auth/login').send({
    email: 'wrongpass@example.com',
    password: 'wrongpassword',
  });

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Login credentials do not exists');
});
