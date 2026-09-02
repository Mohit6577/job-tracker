import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
} from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.get('/me', authMiddleware, getMe);

export default router;
