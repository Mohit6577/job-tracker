import jwt from 'jsonwebtoken';
import env from '../config/env.js';
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const error = new Error('Authentication required');
      error.statusCode = 401;
      return next(error);
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      const error = new Error('Authorization required');
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const authError = new Error('Invalid or expired token');
    authError.statusCode = 401;
    return next(authError);
  }
};

export default authMiddleware;
