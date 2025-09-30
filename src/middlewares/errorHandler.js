export function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.status || 500;
  const message = status === 500 ? 'Something goes wrong' : err.message;
  res.status(status).json({
    status,
    message,
    data: err.message,
  });
}
