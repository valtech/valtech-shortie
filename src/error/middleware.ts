var log = require('../log');

export function handleError(err, req, res, next) {
  log.error('unhandled error', err.stack);
  if (req.accepts('html')) {
    res
      .status(500)
      .render('500');
  } else {
    res.send(500, { error: 'internal server error' });
  }
}
