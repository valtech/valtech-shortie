exports.handleError = function(err, req, res, next) {
  if (req.accepts('html')) {
    res
      .status(500)
      .render('500');
  } else {
    res.send(500, { error: 'internal server error' });
  }
};

exports.handleNotFound = function(req, res) {
  if (req.accepts('html')) {
    res
      .status(404)
      .render('404');
  } else {
    res.send(404, { error: 'not found' });
  }
};
