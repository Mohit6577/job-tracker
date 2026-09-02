const errorMiddleware = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid job ID',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Fill all types',
    });
  }

  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues.map((issue) => ({
        field: issue.path[0],
        code: issue.code,
        message: issue.message,
      })),
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;
