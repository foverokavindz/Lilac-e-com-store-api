export const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;

  error.message = message;

  return error;
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging purposes

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
  });
};

module.exports = errorHandler;
