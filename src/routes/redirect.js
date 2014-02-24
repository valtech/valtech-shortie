exports.get = function(req, res, next) {
  if (req.params.slug == 'cats') {
    res.redirect('http://icanhazcheezburger.com/');
    return;
  }
  next();
};

// all below methods require auth
exports.post = function(req, res, next) {
  // add new redirect with generated slug
  // return 200 and redirect entity in body on success
  // return 400 on invalid data
  next();
};
exports.put = function(req, res, next) {
  // update slug or add redirect with specified slug
  // return 400 on slug/shortUrl mismatch
  // return redirect entity in body on success
};
exports.delete = function(req, res, next) {
  // delete redirect
  // only returns 200 or 404
};