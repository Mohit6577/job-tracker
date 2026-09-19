# Job Tracker

A full-stack job application tracking system built with React, Node.js, Express, and MongoDB.

The application allows users to securely manage their job applications, track application status, search and filter jobs, view application statistics, and update or delete applications.

---

## Features

### Authentication & Security

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- Short-lived access tokens
- Refresh tokens stored in HttpOnly cookies
- Automatic access-token refresh
- Protected API routes
- User-specific job ownership
- Rate limiting on authentication endpoints
- Helmet security headers
- CORS configuration
- Request body size limits

### Job Management

- Create job applications
- View job applications
- Edit existing applications
- Delete applications
- Job status tracking
- Company and position information
- Location and notes
- Application timestamps
- User-specific job data

### Search & Organization

- Search jobs by company or position
- Filter jobs by application status
- Pagination
- Sorting
- Application statistics dashboard

### Frontend

- React
- React Router
- Responsive dashboard
- Job listing interface
- Detailed job view
- Add/Edit job forms
- Toast notifications
- Custom delete confirmation modal
- Loading and error states
- Polished dark-themed UI

### Backend

- REST API built with Express
- MongoDB with Mongoose
- Zod request validation
- Centralized error handling
- Authentication middleware
- Ownership checks
- Pagination and filtering
- Job statistics aggregation

### Testing

- Vitest
- Supertest
- Authentication tests
- Job API tests
- **32 automated tests passing**

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod

### Security

- Helmet
- express-rate-limit
- HttpOnly cookies
- JWT authentication
- CORS

### Testing

- Vitest
- Supertest
- MongoDB Memory Server

---

## Project Structure

```text
job-tracker/
│
├── backend/
│   ├── config/
│   │   └── env.js
│   │
│   ├── controller/
│   │   ├── authController.js
│   │   └── jobController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Job.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── jobRoutes.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── jobValidator.js
│   │
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── job.test.js
│   │
│   ├── app.js
│   ├── server.js
│   ├── seed.js
│   ├── vitest.config.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── ...
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```
