export function getHandler(req, res, next) {
  if (req.params.slug == 'cats') {
    res.redirect('http://icanhazcheezburger.com/');
    return;
  }
  next();
}

export function postHandler(req, res, next) {
  // require auth
  // add new redirect with generated slug
  // return 200 and redirect entity in body on success
  // return 400 on invalid data
  next();
}

export function putHandler(req, res, next) {
  // require auth
  // update slug or add redirect with specified slug
  // return 400 on slug/shortUrl mismatch
  // return redirect entity in body on success
}

export function deleteHandler(req, res, next) {
  // require auth
  // delete redirect
  // only returns 200 or 404
}
