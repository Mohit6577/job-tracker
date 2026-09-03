import { it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { email } from 'zod';

//Authenticate user can create a job
it('authenticated user can create a job', async () => {
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
  const token = response.body.token;
  const userId = response.body.user.id;

  const jobResponse = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Test job',
    });

  expect(jobResponse.status).toBe(201);
  expect(jobResponse.body._id).toBeDefined();
  expect(jobResponse.body.company).toBe('Google');
  expect(jobResponse.body.position).toBe('Backend Engineer');
  expect(jobResponse.body.user).toBe(userId);
});

//Unauthenticated user cannot create job
it('rejects unaunthenticated user from creating a job', async () => {
  const response = await request(app).post('/api/jobs').send({
    company: 'Google',
    position: 'Backend Engineer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Test job',
  });
  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Authentication required');
});

//prevent user from accessing anothr user job
it('prevents a user from accessing another users job', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'user1@example.com',
    password: 'password123',
  });
  const response1 = await request(app).post('/api/auth/login').send({
    email: 'user1@example.com',
    password: 'password123',
  });
  expect(response1.status).toBe(200);
  expect(response1.body.success).toBe(true);
  expect(response1.body.token).toBeDefined();
  const token1 = response1.body.token;
  const userId1 = response1.body.user.id;

  const jobResponse1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Test job',
    });

  expect(jobResponse1.status).toBe(201);
  expect(jobResponse1.body._id).toBeDefined();
  expect(jobResponse1.body.company).toBe('Google');
  expect(jobResponse1.body.position).toBe('Backend Engineer');
  expect(jobResponse1.body.user).toBe(userId1);

  //user 2
  await request(app).post('/api/auth/register').send({
    email: 'user2@example.com',
    password: 'password123',
  });
  const response2 = await request(app).post('/api/auth/login').send({
    email: 'user2@example.com',
    password: 'password123',
  });
  expect(response2.status).toBe(200);
  expect(response2.body.success).toBe(true);
  expect(response2.body.token).toBeDefined();
  const token2 = response2.body.token;
  const userId2 = response2.body.user.id;

  const jobResponse2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Applied',
      location: 'On-Site',
      notes: 'Test job',
    });

  expect(jobResponse2.status).toBe(201);
  expect(jobResponse2.body._id).toBeDefined();
  expect(jobResponse2.body.company).toBe('Apple');
  expect(jobResponse2.body.position).toBe('Frontend Engineer');
  expect(jobResponse2.body.user).toBe(userId2);

  const jobId2 = jobResponse2.body._id;

  const accessResponse = await request(app)
    .get(`/api/jobs/${jobId2}`)
    .set('Authorization', `Bearer ${token1}`);

  expect(accessResponse.status).toBe(404);
  expect(accessResponse.body.success).toBe(false);
  expect(accessResponse.body.message).toBe('Job not found');
});

//prevent user from updating someone else job
it('prevent a user from updating another users job', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'update-user1@example.com',
    password: 'password1',
  });
  const response1 = await request(app).post('/api/auth/login').send({
    email: 'update-user1@example.com',
    password: 'password1',
  });
  expect(response1.status).toBe(200);
  expect(response1.body.success).toBe(true);
  expect(response1.body.token).toBeDefined();

  const token1 = response1.body.token;

  await request(app).post('/api/auth/register').send({
    email: 'update-user2@example.com',
    password: 'password2',
  });
  const response2 = await request(app).post('/api/auth/login').send({
    email: 'update-user2@example.com',
    password: 'password2',
  });
  expect(response2.status).toBe(200);
  expect(response2.body.success).toBe(true);
  expect(response2.body.token).toBeDefined();

  const userId2 = response2.body.user.id;
  const token2 = response2.body.token;

  const jobResponse2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Applied',
      location: 'On-Site',
      notes: 'Test job',
    });
  expect(jobResponse2.status).toBe(201);
  expect(jobResponse2.body._id).toBeDefined();
  expect(jobResponse2.body.company).toBe('Apple');
  expect(jobResponse2.body.position).toBe('Frontend Engineer');
  expect(jobResponse2.body.user).toBe(userId2);

  const jobId2 = jobResponse2.body._id;

  const accessResponse = await request(app)
    .patch(`/api/jobs/${jobId2}`)
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'lenovo',
      position: 'backend Engineer',
    });

  expect(accessResponse.status).toBe(404);
  expect(accessResponse.body.success).toBe(false);
  expect(accessResponse.body.message).toBe('Job not found');
});

//user cant delete other users job
it('prevent a user from delete another users job', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'delete-user1@example.com',
    password: 'password1',
  });
  const response1 = await request(app).post('/api/auth/login').send({
    email: 'delete-user1@example.com',
    password: 'password1',
  });
  expect(response1.status).toBe(200);
  expect(response1.body.success).toBe(true);
  expect(response1.body.token).toBeDefined();

  const token1 = response1.body.token;

  await request(app).post('/api/auth/register').send({
    email: 'delete-user2@example.com',
    password: 'password2',
  });
  const response2 = await request(app).post('/api/auth/login').send({
    email: 'delete-user2@example.com',
    password: 'password2',
  });
  expect(response2.status).toBe(200);
  expect(response2.body.success).toBe(true);
  expect(response2.body.token).toBeDefined();

  const userId2 = response2.body.user.id;
  const token2 = response2.body.token;

  const jobResponse2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Applied',
      location: 'On-Site',
      notes: 'Test job',
    });
  expect(jobResponse2.status).toBe(201);
  expect(jobResponse2.body._id).toBeDefined();
  expect(jobResponse2.body.company).toBe('Apple');
  expect(jobResponse2.body.position).toBe('Frontend Engineer');
  expect(jobResponse2.body.user).toBe(userId2);

  const jobId2 = jobResponse2.body._id;

  const accessResponse = await request(app)
    .delete(`/api/jobs/${jobId2}`)
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'lenovo',
      position: 'backend Engineer',
    });

  expect(accessResponse.status).toBe(404);
  expect(accessResponse.body.success).toBe(false);
  expect(accessResponse.body.message).toBe('Job not found');
});

//test getme verified user
it('authenticated user can get their own job', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'get-user1@example.com',
    password: 'password1',
  });

  const response1 = await request(app).post('/api/auth/login').send({
    email: 'get-user1@example.com',
    password: 'password1',
  });

  expect(response1.status).toBe(200);
  expect(response1.body.success).toBe(true);
  expect(response1.body.token).toBeDefined();

  const userId1 = response1.body.user.id;
  const token1 = response1.body.token;

  const jobResponse = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Test job',
    });

  expect(jobResponse.status).toBe(201);
  expect(jobResponse.body._id).toBeDefined();

  const jobId = jobResponse.body._id;

  const getResponse = await request(app)
    .get(`/api/jobs/${jobId}`)
    .set('Authorization', `Bearer ${token1}`);

  expect(getResponse.status).toBe(200);
  expect(getResponse.body._id).toBe(jobId);
  expect(getResponse.body.company).toBe('Google');
  expect(getResponse.body.position).toBe('Backend Engineer');
  expect(getResponse.body.user).toBe(userId1);
});

//updatin own job
it('updating own job with valid creditinals', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'update-own@example.com',
    password: 'password123',
  });
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'update-own@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  const jobResponse = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Original notes',
    });

  expect(jobResponse.status).toBe(201);
  expect(jobResponse.body._id).toBeDefined();

  const jobId = jobResponse.body._id;

  const updatedResponse = await request(app)
    .patch(`/api/jobs/${jobId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
    });

  expect(updatedResponse.status).toBe(200);
  expect(updatedResponse.body._id).toBe(jobId);
  expect(updatedResponse.body.company).toBe('Apple');
  expect(updatedResponse.body.position).toBe('Frontend Engineer');
});

//delete job
it('delete own job with valid creditinals', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'update-own@example.com',
    password: 'password123',
  });
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'update-own@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  const jobResponse = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Original notes',
    });

  expect(jobResponse.status).toBe(201);
  expect(jobResponse.body._id).toBeDefined();

  const jobId = jobResponse.body._id;

  const deleteResponse = await request(app)
    .delete(`/api/jobs/${jobId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(deleteResponse.status).toBe(200);
  expect(deleteResponse.body._id).toBe(jobId);

  const getResponse = await request(app)
    .get(`/api/jobs/${jobId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(getResponse.status).toBe(404);
  expect(getResponse.body.message).toBe('Job not found');
});

//user only gets own job
it('user only gets their own jobs', async () => {
  // User 1
  await request(app).post('/api/auth/register').send({
    email: 'list-user1@example.com',
    password: 'password123',
  });

  const response1 = await request(app).post('/api/auth/login').send({
    email: 'list-user1@example.com',
    password: 'password123',
  });

  expect(response1.status).toBe(200);
  expect(response1.body.token).toBeDefined();

  const token1 = response1.body.token;
  const userId1 = response1.body.user.id;

  const jobResponse1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'User 1 job',
    });

  expect(jobResponse1.status).toBe(201);
  expect(jobResponse1.body._id).toBeDefined();

  const jobId1 = jobResponse1.body._id;

  // User 2
  await request(app).post('/api/auth/register').send({
    email: 'list-user2@example.com',
    password: 'password123',
  });

  const response2 = await request(app).post('/api/auth/login').send({
    email: 'list-user2@example.com',
    password: 'password123',
  });

  expect(response2.status).toBe(200);
  expect(response2.body.token).toBeDefined();

  const token2 = response2.body.token;
  const userId2 = response2.body.user.id;

  const jobResponse2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token2}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'On-Site',
      notes: 'User 2 job',
    });

  expect(jobResponse2.status).toBe(201);
  expect(jobResponse2.body._id).toBeDefined();

  const jobId2 = jobResponse2.body._id;

  const retrieveJob = await request(app)
    .get('/api/jobs')
    .set('Authorization', `Bearer ${token1}`);
  expect(retrieveJob.status).toBe(200);
  expect(retrieveJob.body.success).toBe(true);
  expect(retrieveJob.body.data).toHaveLength(1);
  expect(retrieveJob.body.data[0]._id).toBe(jobId1);
  expect(retrieveJob.body.data[0].user).toBe(userId1);
  expect(retrieveJob.body.data.some((job) => job._id === jobId2)).toBe(false);
});

//pagination check
it('paginates jobs correctly', async () => {
  // 1. Register user
  await request(app).post('/api/auth/register').send({
    email: 'pagination-user@example.com',
    password: 'password123',
  });

  // 2. Login user
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'pagination-user@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  // 3. Create Job 1
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Job 1',
    });

  expect(job1.status).toBe(201);
  expect(job1.body._id).toBeDefined();

  // 4. Create Job 2
  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'Remote',
      notes: 'Job 2',
    });

  expect(job2.status).toBe(201);
  expect(job2.body._id).toBeDefined();

  // 5. Create Job 3
  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'Offer',
      location: 'Hybrid',
      notes: 'Job 3',
    });

  expect(job3.status).toBe(201);
  expect(job3.body._id).toBeDefined();

  // Save the job IDs
  const jobId1 = job1.body._id;
  const jobId2 = job2.body._id;
  const jobId3 = job3.body._id;

  // 6. Request Page 1 with 2 jobs per page
  const page1 = await request(app)
    .get('/api/jobs?page=1&limit=2')
    .set('Authorization', `Bearer ${token}`);

  expect(page1.status).toBe(200);
  expect(page1.body.success).toBe(true);

  expect(page1.body.data).toHaveLength(2);

  // Newest jobs should come first because default sort is -createdAt
  expect(page1.body.data[0]._id).toBe(jobId3);
  expect(page1.body.data[1]._id).toBe(jobId2);

  expect(page1.body.pagination.page).toBe(1);
  expect(page1.body.pagination.limit).toBe(2);
  expect(page1.body.pagination.totalJobs).toBe(3);
  expect(page1.body.pagination.totalPages).toBe(2);

  // 7. Request Page 2
  const page2 = await request(app)
    .get('/api/jobs?page=2&limit=2')
    .set('Authorization', `Bearer ${token}`);

  expect(page2.status).toBe(200);
  expect(page2.body.success).toBe(true);

  expect(page2.body.data).toHaveLength(1);
  expect(page2.body.data[0]._id).toBe(jobId1);

  expect(page2.body.pagination.page).toBe(2);
  expect(page2.body.pagination.limit).toBe(2);
  expect(page2.body.pagination.totalJobs).toBe(3);
  expect(page2.body.pagination.totalPages).toBe(2);
});

//filter test
it('filters jobs by status', async () => {
  // Register
  await request(app).post('/api/auth/register').send({
    email: 'filter-user@example.com',
    password: 'password123',
  });

  // Login
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'filter-user@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  // Job 1 — Applied
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Applied job',
    });

  expect(job1.status).toBe(201);

  // Job 2 — Interview
  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'Remote',
      notes: 'Interview job',
    });

  expect(job2.status).toBe(201);

  // Job 3 — Rejected
  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'Rejected',
      location: 'Hybrid',
      notes: 'Rejected job',
    });

  expect(job3.status).toBe(201);

  // Filter by Applied
  const filteredResponse = await request(app)
    .get('/api/jobs?status=Applied')
    .set('Authorization', `Bearer ${token}`);

  expect(filteredResponse.status).toBe(200);
  expect(filteredResponse.body.success).toBe(true);

  expect(filteredResponse.body.data).toHaveLength(1);
  expect(filteredResponse.body.data[0].company).toBe('Google');
  expect(filteredResponse.body.data[0].status).toBe('Applied');
});

//search test
it('searches jobs by company and position', async () => {
  // Register
  await request(app).post('/api/auth/register').send({
    email: 'search-user@example.com',
    password: 'password123',
  });

  // Login
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'search-user@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  // Job 1
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Google job',
    });

  expect(job1.status).toBe(201);

  // Job 2
  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'Remote',
      notes: 'Apple job',
    });

  expect(job2.status).toBe(201);

  // Job 3
  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Microsoft',
      position: 'Backend Engineer',
      status: 'Rejected',
      location: 'Hybrid',
      notes: 'Microsoft job',
    });

  expect(job3.status).toBe(201);

  // Search by company
  const googleSearch = await request(app)
    .get('/api/jobs?search=Google')
    .set('Authorization', `Bearer ${token}`);

  expect(googleSearch.status).toBe(200);
  expect(googleSearch.body.success).toBe(true);
  expect(googleSearch.body.data).toHaveLength(1);
  expect(googleSearch.body.data[0].company).toBe('Google');

  // Search by position
  const backendSearch = await request(app)
    .get('/api/jobs?search=Backend')
    .set('Authorization', `Bearer ${token}`);

  expect(backendSearch.status).toBe(200);
  expect(backendSearch.body.success).toBe(true);
  expect(backendSearch.body.data).toHaveLength(2);

  expect(
    backendSearch.body.data.every((job) => job.position === 'Backend Engineer'),
  ).toBe(true);
});

//sort
it('sorts jobs correctly', async () => {
  // Register
  await request(app).post('/api/auth/register').send({
    email: 'sort-user@example.com',
    password: 'password123',
  });

  // Login
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'sort-user@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  // Job 1
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Job 1',
    });

  expect(job1.status).toBe(201);

  // Job 2
  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'Remote',
      notes: 'Job 2',
    });

  expect(job2.status).toBe(201);

  // Job 3
  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'Rejected',
      location: 'Hybrid',
      notes: 'Job 3',
    });

  expect(job3.status).toBe(201);

  // Company ascending: Apple → Google → Microsoft
  const ascending = await request(app)
    .get('/api/jobs?sort=company')
    .set('Authorization', `Bearer ${token}`);

  expect(ascending.status).toBe(200);
  expect(ascending.body.success).toBe(true);
  expect(ascending.body.data).toHaveLength(3);

  expect(ascending.body.data[0].company).toBe('Apple');
  expect(ascending.body.data[1].company).toBe('Google');
  expect(ascending.body.data[2].company).toBe('Microsoft');

  // Company descending: Microsoft → Google → Apple
  const descending = await request(app)
    .get('/api/jobs?sort=-company')
    .set('Authorization', `Bearer ${token}`);

  expect(descending.status).toBe(200);
  expect(descending.body.success).toBe(true);
  expect(descending.body.data).toHaveLength(3);

  expect(descending.body.data[0].company).toBe('Microsoft');
  expect(descending.body.data[1].company).toBe('Google');
  expect(descending.body.data[2].company).toBe('Apple');

  // Default sort: newest first
  const newestFirst = await request(app)
    .get('/api/jobs')
    .set('Authorization', `Bearer ${token}`);

  expect(newestFirst.status).toBe(200);
  expect(newestFirst.body.success).toBe(true);
  expect(newestFirst.body.data).toHaveLength(3);

  expect(newestFirst.body.data[0]._id).toBe(job3.body._id);
  expect(newestFirst.body.data[1]._id).toBe(job2.body._id);
  expect(newestFirst.body.data[2]._id).toBe(job1.body._id);
});

//unsupported sort test
it('falls back to default sorting for an invalid sort field', async () => {
  // Register
  await request(app).post('/api/auth/register').send({
    email: 'invalid-sort-user@example.com',
    password: 'password123',
  });

  // Login
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'invalid-sort-user@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  // Create Job 1
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
      notes: 'Job 1',
    });

  expect(job1.status).toBe(201);

  // Create Job 2
  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'Remote',
      notes: 'Job 2',
    });

  expect(job2.status).toBe(201);

  // Create Job 3
  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'Offer',
      location: 'Hybrid',
      notes: 'Job 3',
    });

  expect(job3.status).toBe(201);

  // Invalid sort field
  const response = await request(app)
    .get('/api/jobs?sort=password')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toHaveLength(3);

  // Should fall back to -createdAt (newest first)
  expect(response.body.data[0]._id).toBe(job3.body._id);
  expect(response.body.data[1]._id).toBe(job2.body._id);
  expect(response.body.data[2]._id).toBe(job1.body._id);
});

//handle pagination bounds
it('handles pagination bounds correctly', async () => {
  // Register
  await request(app).post('/api/auth/register').send({
    email: 'pagination-bounds@example.com',
    password: 'password123',
  });

  // Login
  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'pagination-bounds@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.success).toBe(true);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  // Create 3 jobs
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
    });

  expect(job1.status).toBe(201);

  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Interview',
      location: 'Remote',
    });

  expect(job2.status).toBe(201);

  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'Offer',
      location: 'Hybrid',
    });

  expect(job3.status).toBe(201);

  // page=0 should be treated as page 1
  const invalidPage = await request(app)
    .get('/api/jobs?page=0&limit=2')
    .set('Authorization', `Bearer ${token}`);

  expect(invalidPage.status).toBe(200);
  expect(invalidPage.body.success).toBe(true);
  expect(invalidPage.body.pagination.page).toBe(1);
  expect(invalidPage.body.pagination.limit).toBe(2);
  expect(invalidPage.body.data).toHaveLength(2);

  // limit=0 should fall back to the default limit of 5
  const zeroLimit = await request(app)
    .get('/api/jobs?page=1&limit=0')
    .set('Authorization', `Bearer ${token}`);

  expect(zeroLimit.status).toBe(200);
  expect(zeroLimit.body.success).toBe(true);
  expect(zeroLimit.body.pagination.page).toBe(1);
  expect(zeroLimit.body.pagination.limit).toBe(5);
  expect(zeroLimit.body.data).toHaveLength(3);

  // limit=200 should be capped at 100
  const hugeLimit = await request(app)
    .get('/api/jobs?page=1&limit=200')
    .set('Authorization', `Bearer ${token}`);

  expect(hugeLimit.status).toBe(200);
  expect(hugeLimit.body.success).toBe(true);
  expect(hugeLimit.body.pagination.page).toBe(1);
  expect(hugeLimit.body.pagination.limit).toBe(100);
  expect(hugeLimit.body.data).toHaveLength(3);
});

//api with no jobs
it('returns empty data when user has no jobs', async () => {
  await request(app).post('/api/auth/register').send({
    email: 'empty-jobs@example.com',
    password: 'password123',
  });

  const loginResponse = await request(app).post('/api/auth/login').send({
    email: 'empty-jobs@example.com',
    password: 'password123',
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.token).toBeDefined();

  const token = loginResponse.body.token;

  const response = await request(app)
    .get('/api/jobs')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toHaveLength(0);

  expect(response.body.pagination.page).toBe(1);
  expect(response.body.pagination.limit).toBe(5);
  expect(response.body.pagination.totalJobs).toBe(0);
  expect(response.body.pagination.totalPages).toBe(0);
});

//jobStats
it('returns job stats for the authenticated user only', async () => {
  // =========================
  // USER 1 — register + login
  // =========================

  await request(app).post('/api/auth/register').send({
    email: 'stats-user1@example.com',
    password: 'password123',
  });

  const loginResponse1 = await request(app).post('/api/auth/login').send({
    email: 'stats-user1@example.com',
    password: 'password123',
  });

  expect(loginResponse1.status).toBe(200);
  expect(loginResponse1.body.success).toBe(true);
  expect(loginResponse1.body.token).toBeDefined();

  const token1 = loginResponse1.body.token;

  // =========================
  // USER 1 — create 4 jobs
  // =========================

  // Applied
  const job1 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Google',
      position: 'Backend Engineer',
      status: 'Applied',
      location: 'Remote',
    });

  expect(job1.status).toBe(201);

  // Applied
  const job2 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Apple',
      position: 'Frontend Engineer',
      status: 'Applied',
      location: 'Remote',
    });

  expect(job2.status).toBe(201);

  // Interview
  const job3 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Microsoft',
      position: 'Full Stack Engineer',
      status: 'Interview',
      location: 'Hybrid',
    });

  expect(job3.status).toBe(201);

  // Rejected
  const job4 = await request(app)
    .post('/api/jobs')
    .set('Authorization', `Bearer ${token1}`)
    .send({
      company: 'Amazon',
      position: 'Software Engineer',
      status: 'Rejected',
      location: 'Remote',
    });

  expect(job4.status).toBe(201);

  // =========================
  // USER 2 — register + login
  // =========================

  await request(app).post('/api/auth/register').send({
    email: 'stats-user2@example.com',
    password: 'password123',
  });

  const loginResponse2 = await request(app).post('/api/auth/login').send({
    email: 'stats-user2@example.com',
    password: 'password123',
  });

  expect(loginResponse2.status).toBe(200);
  expect(loginResponse2.body.success).toBe(true);
  expect(loginResponse2.body.token).toBeDefined();

  const token2 = loginResponse2.body.token;

  // =========================
  // USER 2 — create 5 Applied jobs
  // =========================

  for (let i = 1; i <= 5; i++) {
    const job = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${token2}`)
      .send({
        company: `Company ${i}`,
        position: 'Software Engineer',
        status: 'Applied',
        location: 'Remote',
      });

    expect(job.status).toBe(201);
  }

  // =========================
  // USER 1 — get stats
  // =========================

  const statsResponse = await request(app)
    .get('/api/jobs/stats')
    .set('Authorization', `Bearer ${token1}`);

  expect(statsResponse.status).toBe(200);
  expect(statsResponse.body.success).toBe(true);

  expect(statsResponse.body.stats.Applied).toBe(2);
  expect(statsResponse.body.stats.Interview).toBe(1);
  expect(statsResponse.body.stats.Rejected).toBe(1);
  expect(statsResponse.body.stats.Offer).toBe(0);
  expect(statsResponse.body.stats.Accepted).toBe(0);
});

//unauthenticated stats
it('rejects unauthenticated user from getting job stats', async () => {
  const response = await request(app).get('/api/jobs/stats');

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toBe('Authentication required');
});
