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

router.post('/', validateCreateJob, createJob);
router.get('/', getJobs);
router.get('/:id', getJob);
router.patch('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
