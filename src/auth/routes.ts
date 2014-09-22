/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />

import util = require('util');
import qs = require('querystring');
import express = require('express');
var uuid = require('node-uuid');


import authMiddleware = require('./middleware');
var log = require('../log');

var request = require('request');

var IDP_BASE_URL = process.env.IDP_BASE_URL || 'https://stage-id.valtech.com';
var IDP_AUTHORIZE_URL = IDP_BASE_URL + '/oauth2/authorize';
var IDP_TOKEN_URL = IDP_BASE_URL + '/oauth2/token';
var IDP_USERS_ME_URL = IDP_BASE_URL + '/api/users/me';
var IDP_END_SESSION_URL = IDP_BASE_URL + '/oidc/end-session';

var IDP_CLIENT_ID = process.env.IDP_CLIENT_ID;
var IDP_CLIENT_SECRET = process.env.IDP_CLIENT_SECRET;

var AUTH_MODE = process.env.AUTH_MODE;

function login(req, res, next) {
  if (req.authSession.signed_in === true) return res.redirect('/admin');

  // It is important to validate that the URLs we redirect to after successful sign in
  // are actually "located on valtech shortie", and not external URLs *or* redirects
  // to external URLs. Otherwise we become an open redirector, exposing us / idp to
  // certain attacks.
  // We solve this by being conservative in what redirects we accept
  var redirect = req.query.redirect || '/admin';
  if (redirect !== '/admin' && redirect.indexOf('/admin/') !== 0) return res.status(400).json({ error_description: 'Invalid redirect.'});
  req.authSession.redirectAfterLogin = req.query.redirect;

  if (AUTH_MODE !== 'idp') {
    // do anonymous authentication
    var user = {
      email: 'anonymous.user@test.me',
      name: 'Anonymous',
      country_code: 'se'
    };
    signUserIn(req, user, function(err) {
      if (err) return next(err);

      redirectAfterSignIn(req, res);
    });
    return;
  }

  req.authSession.oauthState = uuid.v4();

  var authorizeParams = {
    response_type: 'code',
    client_id: IDP_CLIENT_ID,
    scope: 'profile email',
    state: req.authSession.oauthState,
  };
  var redirectUrl = IDP_AUTHORIZE_URL + '?' + qs.stringify(authorizeParams);

  log.info('oauth2 redirecting to authorize', { url: redirectUrl });
  res.redirect(redirectUrl);
}

function logout(req, res) {
  var csrfToken = req.query._csrf;
  if (req.authSession.signOutCsrfToken && req.authSession.signOutCsrfToken !== csrfToken) {
    // authSessions created before 2014-08-11 didn't have the signOutCsrfToken.
    // For now, allow sign-outs for such sessions
    return res.status(400).send("invalid csrf token");
  }

  var isAnonymousSession = req.authSession.email === 'anonymous.user@test.me';

  req.authSession.reset();

  if (isAnonymousSession) return res.redirect('/');

  var endSessionParams = {
    client_id: IDP_CLIENT_ID,
  };

  var redirectUrl = IDP_END_SESSION_URL + '?' + qs.stringify(endSessionParams);
  res.redirect(redirectUrl);
}

function callback(req, res, next) {
  if (req.query.error) return next(new Error('OAuth error: ' + req.query.error + ', description: ' + req.query.error_description));
  if (!req.query.code || !req.query.state) return res.status(400).json({ error_description: 'Missing code or stage.'});

  var code = req.query.code;
  var state = req.query.state;

  if (state !== req.authSession.oauthState) return res.status(400).json({ error: 'Invalid state.' });
  delete req.authSession.oauthState;

  exchangeCodeForAccessToken(code, function(err, accessToken) {
    if (err) return next(err);

    fetchUserInfo(accessToken, function(err, user) {
      if (err) return next(err);

      signUserIn(req, user, function(err) {
        if (err) return next(err);

        redirectAfterSignIn(req, res);
      });
    });
  });
}

function exchangeCodeForAccessToken(code, callback) {
  var tokenOptions = {
    url: IDP_TOKEN_URL,
    json: true,
    body: {
      grant_type: 'authorization_code',
      code: code,
      client_id: IDP_CLIENT_ID,
      client_secret: IDP_CLIENT_SECRET,
    }
  };

  request.post(tokenOptions, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(new Error(res.statusCode + ' from idp, body: ' + JSON.stringify(body)));

    callback(null, body.access_token);
  });
}

function fetchUserInfo(accessToken, callback) {
  var usersMeOptions = {
    url: IDP_USERS_ME_URL,
    json: true,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request.get(usersMeOptions, function(err, res, user) {
    if (err) return callback(err);
    if (res.statusCode !== 200) return callback(new Error(res.statusCode + ' from idp, WWW-Authenticate: ' + JSON.stringify(res.headers['www-authenticate'])));

    callback(null, user);
  });
}

function signUserIn(req, user, callback) {
  req.authSession.profile = {
    email: user.email,
    name: user.name,
    countryCode: user.country_code,
  };
  req.authSession.signed_in = true;
  // We need to protect the GET /logout request against csrf
  // Since logout is a GET, when used the csrf token is to be considered used and invalid
  req.authSession.signOutCsrfToken = uuid.v4();

  log.info('successfully logged user in', req.authSession.profile);
  callback(null);
}

function redirectAfterSignIn(req, res) {
  var redirect = '/admin';
  if (req.authSession.redirectAfterLogin) {
    redirect = req.authSession.redirectAfterLogin;
    delete req.authSession.redirectAfterLogin;
  }
  log.info('redirecting back to', redirect);
  res.redirect(redirect);
}

function viewSession(req, res) {
  res.send(200, req.authSession);
}

export function setup(app: express.Application): void {
  app.get('/login', login);
  app.get('/login/callback', callback);
  app.get('/logout', logout);
  app.get('/me', authMiddleware.requireAuthCookieOrRedirect, viewSession);
}
