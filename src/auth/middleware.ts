/// <reference path="../../.types/node/node.d.ts" />

var util = require('util'),
  qs = require('querystring');

export function requireAuth(req, res, next) {
  if (req.authSession.signed_in !== true) {
    var url = util.format('/login?redirect=%s', qs.escape(req.path));
    return res.redirect(url);
  }
  next();
}
