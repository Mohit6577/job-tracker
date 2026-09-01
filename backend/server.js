import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use(errorMiddleware);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection failed', err.message);
  });

app.get('/api/health', (req, res) => {
  res.json('status:ok');
});

app.listen(PORT, () => {
  console.log(`Server is runing on 5000`);
});
