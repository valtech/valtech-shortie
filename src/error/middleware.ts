export function handleError(err, req, res, next) {
  if (req.accepts('html')) {
    res
      .status(500)
      .render('500');
  } else {
    res.send(500, { error: 'internal server error' });
  }
}
