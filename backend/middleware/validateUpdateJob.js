import { updateJobSchema } from '../validators/jobValidator.js';

const validateUpdateJob = (req, res, next) => {
  const result = updateJobSchema.safeParse(req.body);
  if (!result.success) {
    return next(result.error);
  }
  req.body = result.data;
  next();
};

export default validateUpdateJob;
