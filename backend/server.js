import mongoose from 'mongoose';
import env from './config/env.js';
import app from './app.js';

const PORT = env.PORT || 5000;

mongoose
  .connect(env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server is runing on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed', err.message);
  });
