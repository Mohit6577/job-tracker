import { z } from 'zod';

const registerSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase().trim()),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  next();
};

const loginSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase().trim()),
  password: z.string(),
});

const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return next(result.error);
  }

  req.body = result.data;
  next();
};

export { validateRegister, validateLogin };
