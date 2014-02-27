var util = require('util'),
    request = require('request'),
    qs = require('querystring');

// This client token is for the 'valte.ch localhost' application in vauth (with id 19)
var VAUTH_CONSUMER_KEY = 'wix6Iz249hFjMsXI7QcfUTKl8oXVH4CfYNSE7cED',
    VAUTH_CONSUMER_SECRET = 'L76UBmoGjx3Veq8MLi622yAUZMwAMgchikIEJeI2';

var VAUTH_HOST = 'vauth.valtech.se',
    VAUTH_REQUEST_TOKEN_URL = util.format('https://%s/oauth/request_token', VAUTH_HOST),
    VAUTH_ACCESS_TOKEN_URL = util.format('https://%s/oauth/access_token', VAUTH_HOST),
    VAUTH_AUTHORIZE_URL = util.format('https://%s/oauth/authorize', VAUTH_HOST),
    VAUTH_PROFILE_URL = util.format('https://%s/users/me', VAUTH_HOST),
    VAUTH_USERS_URL = util.format('https://%s/users/', VAUTH_HOST);

exports.login = function(req, res, next) {
  var oauth_body = {
    consumer_key: VAUTH_CONSUMER_KEY,
    consumer_secret: VAUTH_CONSUMER_SECRET,
    callback: 'http://localhost:3000/authenticated' // TODO: Build callback from currently used scheme + hostname
  };
  request.post({ url: VAUTH_REQUEST_TOKEN_URL, oauth: oauth_body }, function(vauthErr, vauthRes, vauthBody) {
    var statusCode = vauthRes.statusCode;
    if (vauthErr || statusCode != 200) {
      return next('invalid response from vauth: ' + statusCode + '. ' + vauthBody);
    }
    var request_token = qs.parse(vauthBody);
    req.session.request_token = request_token;
    console.log('sucessfully got a request token',  request_token);

    var authorize_url = util.format('%s?oauth_token=%s', VAUTH_AUTHORIZE_URL, request_token.oauth_token);
    res.redirect(authorize_url);
  });
};

exports.logout = function(req, res) {
  req.session = null;
  res.send(200, "logout");
};

exports.authenticated = function(req, res, next) {
  var token = req.session.request_token;
  req.session.request_token = null; // TODO: Should we clear the request token from the session here?
  if (req.query.oauth_verifier) {
    token.oauth_verifier = req.query.oauth_verifier;
  }
  var oauth_body = {
    consumer_key: VAUTH_CONSUMER_KEY,
    consumer_secret: VAUTH_CONSUMER_SECRET,
    token: token.oauth_token,
    token_secret: token.oauth_token_secret,
    verifier: token.oauth_verifier
  };
  request.post({ url: VAUTH_ACCESS_TOKEN_URL, oauth: oauth_body }, function(vauthErr, vauthRes, vauthBody) {
    var statusCode = vauthRes.statusCode;
    if (vauthErr || statusCode != 200) {
      return next('invalid response from vauth: ' + statusCode + '. ' + vauthBody);
    }
    var token = qs.parse(vauthBody);
    console.log('sucessfully got an access token',  token);
    load_profile(token, function(err, profile) {
      if (err) return next(err);
      console.log('got a profile', profile);
      res.send(200, profile);
    });
  });
};

function load_profile(token, callback) {
  var oauth_body = {
    consumer_key: VAUTH_CONSUMER_KEY,
    consumer_secret: VAUTH_CONSUMER_SECRET,
    token: token.oauth_token,
    token_secret: token.oauth_token_secret,
  };
  var headers = {
    'Accept': '*/*'
  };
  request.get({ url: VAUTH_PROFILE_URL, oauth: oauth_body, headers: headers }, function(vauthErr, vauthRes, vauthBody) {
    var statusCode = vauthRes.statusCode;
    if (vauthErr || statusCode != 200) {
      return callback('invalid response from vauth: ' + statusCode + '. ' + vauthBody);
    }

    callback(null, vauthBody);
  });
}
