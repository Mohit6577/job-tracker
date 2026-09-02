import { Router } from 'express';
const router = Router();
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getJobStats,
} from '../controller/jobController.js';
import validateCreateJob from '../middleware/validateJob.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateUpdateJob from '../middleware/validateUpdateJob.js';

router.post('/', authMiddleware, validateCreateJob, createJob);
router.get('/', authMiddleware, getJobs);
router.get('/stats', authMiddleware, getJobStats);
router.get('/:id', authMiddleware, getJob);
router.patch('/:id', authMiddleware, validateUpdateJob, updateJob);
router.delete('/:id', authMiddleware, deleteJob);

export default router;
