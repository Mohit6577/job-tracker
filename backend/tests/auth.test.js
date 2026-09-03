import { it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import jwt from 'jsonwebtoken';
import env from '../config/env.js';

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
  expect(response.body.message).toBe('Login credentials does not exists');
});

//nonexistent user login
it('rejects login for a nonexistent user', async () => {
  const response = await request(app).post('/api/auth/login').send({
    email: 'doesnotexist@example.com',
    password: 'password123',
  });

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
});

//invalid registration data
it('rejects registration with invalid email', async () => {
  const response = await request(app).post('/api/auth/register').send({
    email: 'not-an-email',
    password: 'password123',
  });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

//short password
it('rejects registration with a short password', async () => {
  const response = await request(app).post('/api/auth/register').send({
    email: 'short@example.com',
    password: '123',
  });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

//reject with invalid email
it('rejects login with invalid email', async () => {
  const response = await request(app).post('/api/auth/login').send({
    email: 'not-an-email',
    password: 'password123',
  });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
});

//returns authenticated used
it('returns the authenticated user', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'me-user@example.com',
    password: 'password123',
  });

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'me-user@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.user.email).toBe('me-user@example.com');
  expect(response.body.user.password).toBeUndefined();
});

//without token tryin to get current user
it('rejects unauthenticated user from getting current user', async () => {
  const response = await request(app).get('/api/auth/me');

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Authentication required');
});

//inaavlid bearer token
it('rejects invalid token from getting current user', async () => {
  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', 'Bearer invalid-token');

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
});

//expired jwt token
it('rejects expired token from getting current user', async () => {
  const expiredToken = jwt.sign(
    { userId: '507f1f77bcf86cd799439011' },
    env.JWT_SECRET,
    { expiresIn: -1 },
  );

  const response = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${expiredToken}`);

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Invalid or expired token');
});

//case-sensitive
it('normalizes user email', async () => {
  const response = await request(app).post('/api/auth/register').send({
    email: 'USER@EXAMPLE.COM',
    password: 'password123',
  });

  expect(response.status).toBe(201);
  expect(response.body.user.email).toBe('user@example.com');
});
