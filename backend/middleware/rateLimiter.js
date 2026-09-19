import rateLimit from 'express-rate-limit';
const authLimiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP',
  skip: () => process.env.NODE_ENV === 'test',
});
export { authLimiter };
