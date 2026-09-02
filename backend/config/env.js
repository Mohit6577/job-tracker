import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  PORT: z.coerce.number().min(1000).optional(),
});
const env = envSchema.parse(process.env);

export default env;
