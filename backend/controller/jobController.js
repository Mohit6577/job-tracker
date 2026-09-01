import Job from '../models/Job.js';

const createJob = async (req, res, next) => {
  try {
    const job = new Job({ ...req.body, user: req.user.userId });

    await job.save();

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const filter = { user: req.user.userId };
    const status = req.query.status?.trim();
    const search = req.query.search?.trim();
    const sortQuery = req.query.sort || '-createdAt';
    const allowedSortFields = ['createdAt', 'company', 'position', 'status'];

    const sortField = sortQuery.startsWith('-')
      ? sortQuery.slice(1)
      : sortQuery;

    const sortOrder = sortQuery.startsWith('-') ? -1 : 1;

    const sort = allowedSortFields.includes(sortField)
      ? { [sortField]: sortOrder }
      : { createdAt: -1 };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          company: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          position: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }

    const [jobs, totalJobs] = await Promise.all([
      Job.find(filter).sort(sort).skip(skip).limit(limit),
      Job.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalJobs / limit);
    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        totalJobs,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: 'job not found',
      });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

export { createJob, getJobs, getJob, updateJob, deleteJob };
