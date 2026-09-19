import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  refreshAccessToken,
} from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  validateLogin,
  validateRegister,
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.get('/me', authMiddleware, getMe);
router.post('/refresh', refreshAccessToken);

export default router;
