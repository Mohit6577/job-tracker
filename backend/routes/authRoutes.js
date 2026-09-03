import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getMe,
} from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  validateLogin,
  validateRegister,
} from '../validators/authValidator.js';

const router = Router();

router.post('/register', validateRegister, authLimiter, registerUser);
router.post('/login', validateLogin, authLimiter, loginUser);
router.get('/me', authMiddleware, getMe);

export default router;
