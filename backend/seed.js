import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Job from './models/Job.js';

dotenv.config();

const jobs = [
  {
    company: 'Google',
    position: 'Frontend Developer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through LinkedIn',
  },
  {
    company: 'Microsoft',
    position: 'Backend Engineer',
    status: 'Interview',
    location: 'Hyderabad',
    notes: 'Technical interview scheduled',
  },
  {
    company: 'Amazon',
    position: 'Software Development Engineer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through careers portal',
  },
  {
    company: 'Meta',
    position: 'React Developer',
    status: 'Rejected',
    location: 'Remote',
    notes: 'Rejected after technical round',
  },
  {
    company: 'Apple',
    position: 'iOS Developer',
    status: 'Applied',
    location: 'Hyderabad',
    notes: 'Resume submitted',
  },
  {
    company: 'Netflix',
    position: 'Backend Engineer',
    status: 'Interview',
    location: 'Remote',
    notes: 'Hiring manager interview',
  },
  {
    company: 'Adobe',
    position: 'Full Stack Developer',
    status: 'Offer',
    location: 'Noida',
    notes: 'Offer received',
  },
  {
    company: 'Oracle',
    position: 'Java Developer',
    status: 'Applied',
    location: 'Hyderabad',
    notes: 'Applied through referral',
  },
  {
    company: 'Salesforce',
    position: 'Node.js Developer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'First technical round',
  },
  {
    company: 'Tesla',
    position: 'Software Engineer',
    status: 'Rejected',
    location: 'Remote',
    notes: 'Application rejected',
  },
  {
    company: 'Uber',
    position: 'Backend Engineer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through company website',
  },
  {
    company: 'Airbnb',
    position: 'Frontend Engineer',
    status: 'Interview',
    location: 'Remote',
    notes: 'Frontend interview pending',
  },
  {
    company: 'Spotify',
    position: 'React Engineer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Application submitted',
  },
  {
    company: 'Stripe',
    position: 'Full Stack Engineer',
    status: 'Interview',
    location: 'Remote',
    notes: 'Recruiter contacted me',
  },
  {
    company: 'Atlassian',
    position: 'Backend Developer',
    status: 'Rejected',
    location: 'Bangalore',
    notes: 'Rejected after interview',
  },
  {
    company: 'GitHub',
    position: 'Software Engineer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Applied directly',
  },
  {
    company: 'GitLab',
    position: 'DevOps Engineer',
    status: 'Interview',
    location: 'Remote',
    notes: 'Infrastructure interview',
  },
  {
    company: 'Shopify',
    position: 'Full Stack Developer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Application submitted',
  },
  {
    company: 'Twilio',
    position: 'Node.js Engineer',
    status: 'Rejected',
    location: 'Remote',
    notes: 'Rejected after screening',
  },
  {
    company: 'Datadog',
    position: 'Backend Engineer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Resume submitted',
  },
  {
    company: 'NVIDIA',
    position: 'Software Engineer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'Coding round scheduled',
  },
  {
    company: 'Intel',
    position: 'Backend Developer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through referral',
  },
  {
    company: 'AMD',
    position: 'Systems Engineer',
    status: 'Rejected',
    location: 'Hyderabad',
    notes: 'Position closed',
  },
  {
    company: 'Cisco',
    position: 'Network Software Engineer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'Technical discussion pending',
  },
  {
    company: 'SAP',
    position: 'Java Developer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Application submitted',
  },
  {
    company: 'Wipro',
    position: 'MERN Stack Developer',
    status: 'Applied',
    location: 'Pune',
    notes: 'Applied through careers portal',
  },
  {
    company: 'Infosys',
    position: 'React Developer',
    status: 'Interview',
    location: 'Pune',
    notes: 'HR round completed',
  },
  {
    company: 'TCS',
    position: 'Node.js Developer',
    status: 'Rejected',
    location: 'Chennai',
    notes: 'Rejected after technical assessment',
  },
  {
    company: 'Accenture',
    position: 'Full Stack Engineer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Application submitted',
  },
  {
    company: 'Deloitte',
    position: 'Software Engineer',
    status: 'Interview',
    location: 'Hyderabad',
    notes: 'Technical round scheduled',
  },
  {
    company: 'PwC',
    position: 'Backend Engineer',
    status: 'Applied',
    location: 'Mumbai',
    notes: 'Applied through LinkedIn',
  },
  {
    company: 'KPMG',
    position: 'Java Developer',
    status: 'Rejected',
    location: 'Gurgaon',
    notes: 'Application rejected',
  },
  {
    company: 'Razorpay',
    position: 'Node.js Developer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'Recruiter call completed',
  },
  {
    company: 'Swiggy',
    position: 'Frontend Engineer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through website',
  },
  {
    company: 'Zomato',
    position: 'Backend Engineer',
    status: 'Offer',
    location: 'Gurgaon',
    notes: 'Offer received',
  },
  {
    company: 'Flipkart',
    position: 'Software Engineer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'System design round',
  },
  {
    company: 'Paytm',
    position: 'Full Stack Developer',
    status: 'Applied',
    location: 'Noida',
    notes: 'Resume submitted',
  },
  {
    company: 'PhonePe',
    position: 'Backend Developer',
    status: 'Rejected',
    location: 'Bangalore',
    notes: 'Rejected after coding round',
  },
  {
    company: 'CRED',
    position: 'React Developer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through referral',
  },
  {
    company: 'Meesho',
    position: 'Software Engineer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'Technical interview pending',
  },
  {
    company: 'Myntra',
    position: 'Frontend Developer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Application submitted',
  },
  {
    company: 'Zoho',
    position: 'Java Developer',
    status: 'Rejected',
    location: 'Chennai',
    notes: 'Rejected after assessment',
  },
  {
    company: 'Freshworks',
    position: 'Full Stack Engineer',
    status: 'Interview',
    location: 'Chennai',
    notes: 'Technical round scheduled',
  },
  {
    company: 'Postman',
    position: 'Backend Engineer',
    status: 'Applied',
    location: 'Bangalore',
    notes: 'Applied through careers page',
  },
  {
    company: 'BrowserStack',
    position: 'SDET',
    status: 'Interview',
    location: 'Mumbai',
    notes: 'Automation round pending',
  },
  {
    company: 'Thoughtworks',
    position: 'Software Developer',
    status: 'Applied',
    location: 'Pune',
    notes: 'Application submitted',
  },
  {
    company: 'ServiceNow',
    position: 'Backend Engineer',
    status: 'Rejected',
    location: 'Hyderabad',
    notes: 'Rejected after technical round',
  },
  {
    company: 'LinkedIn',
    position: 'Software Engineer',
    status: 'Interview',
    location: 'Bangalore',
    notes: 'Recruiter contacted me',
  },
  {
    company: 'Dropbox',
    position: 'Full Stack Engineer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Applied through company portal',
  },
  {
    company: 'Slack',
    position: 'Backend Developer',
    status: 'Offer',
    location: 'Remote',
    notes: 'Offer received',
  },
  {
    company: 'Cloudflare',
    position: 'Software Engineer',
    status: 'Applied',
    location: 'Remote',
    notes: 'Application submitted',
  },
  {
    company: 'OpenAI',
    position: 'Backend Engineer',
    status: 'Interview',
    location: 'Remote',
    notes: 'Technical interview scheduled',
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected');

    await Job.deleteMany({});
    console.log('Old jobs deleted');

    await Job.insertMany(jobs);
    console.log(`${jobs.length} jobs inserted`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
