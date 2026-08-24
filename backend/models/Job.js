import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Applied', 'Interview', 'Rejected', 'Offer', 'Accepted'],
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);
const Job = mongoose.model('Job', jobSchema);
export default Job;
