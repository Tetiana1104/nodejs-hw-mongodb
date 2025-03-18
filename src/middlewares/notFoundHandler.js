import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  console.log(`❌ Not Found: ${req.method} ${req.originalUrl}`);
  next(createHttpError(404, 'Route not found'));
};
