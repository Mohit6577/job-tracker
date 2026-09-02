import { createJobSchema } from '../validators/jobValidator.js';

const validateCreateJob = (req, res, next) => {
  const result = createJobSchema.safeParse(req.body);
  if (!result.success) {
    return next(result.error);
  }
  req.body = result.data;
  next();
};
export default validateCreateJob;
