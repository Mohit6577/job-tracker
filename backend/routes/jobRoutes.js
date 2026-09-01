import { Router } from 'express';
const router = Router();
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
} from '../controller/jobController.js';
import validateCreateJob from '../middleware/validateJob.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/', authMiddleware, validateCreateJob, createJob);
router.get('/', authMiddleware, getJobs);
router.get('/:id', getJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
