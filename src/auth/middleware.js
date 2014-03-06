var util = require('util'), qs = require('querystring');

function requireAuth(req, res, next) {
    if (req.authSession.signed_in !== true) {
        var url = util.format('/login?shortie=%s', qs.escape(req.path));
        return res.shortie(url);
    }
    next();
}
exports.requireAuth = requireAuth;
