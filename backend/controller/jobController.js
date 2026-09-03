import Job from '../models/Job.js';
import mongoose from 'mongoose';

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
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 100);
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
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      },
    );
    if (!job) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!job) {
      const error = new Error('Job not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json(job);
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const stats = await Job.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = stats.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {
        Applied: 0,
        Interview: 0,
        Rejected: 0,
        Offer: 0,
        Accepted: 0,
      },
    );

    res.status(200).json({
      success: true,
      stats: formattedStats,
    });
  } catch (error) {
    next(error);
  }
};

export { createJob, getJobs, getJob, updateJob, deleteJob, getJobStats };
