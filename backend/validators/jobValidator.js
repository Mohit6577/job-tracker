import { z } from 'zod';

const createJobSchema = z.object({
  company: z.string(),
  position: z.string(),
  status: z.enum(['Applied', 'Interview', 'Rejected', 'Offer', 'Accepted']),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export { createJobSchema };
