import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import env from './config/env.js';
import cookieParser from 'cookie-parser';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use(errorMiddleware);

export default app;
