exports.errorResponse = (res, statusCode = 400, message = "Something went wrong", errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

exports.successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
