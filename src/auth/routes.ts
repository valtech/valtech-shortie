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

var IDP_CLIENT_ID = process.env.IDP_CLIENT_ID || 'local.valtech.shortie';
var IDP_CLIENT_SECRET = process.env.IDP_CLIENT_SECRET || 'wRNntVkUoiFuC8kJRNDOligNO6btLZrYQz7Oq1NX';
var IDP_CLIENT_REDIRECT_URI = process.env.IDP_CLIENT_REDIRECT_URI || 'http://localhost:3000/login/callback';

function login(req, res, next) {
  if (req.authSession.signed_in === true) {
    return res.redirect('/me?alreadySignedIn');
  }

  req.authSession.redirectAfterLogin = req.query.redirect;
  req.authSession.oauthState = uuid.v4();

  var authorizeParams = {
    response_type: 'code',
    client_id: IDP_CLIENT_ID,
    redirect_uri: IDP_CLIENT_REDIRECT_URI,
    scope: 'profile',
    state: req.authSession.oauthState,
  };
  var redirectUrl = IDP_AUTHORIZE_URL + '?' + qs.stringify(authorizeParams);

  log.info('oauth2 redirecting to authorize', { url: redirectUrl });
  res.redirect(redirectUrl);
}

function logout(req, res) {
  req.authSession.reset();
  res.redirect('/');
}

function callback(req, res, next) {
  if (req.query.error) return next(new Error('OAuth error: ' + req.query.error + ', description: ' + req.query.error_description));
  if (!req.query.code || !req.query.state) return next();

  var code = req.query.code;
  var state = req.query.state;

  if (state !== req.authSession.oauthState) return res.redirect('/?invalidState');
  delete req.authSession.oauthState;

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

  request.post(tokenOptions, function(err, tres, tbody) {
    if (err) return next(err);
    if (tres.statusCode !== 200) return next(new Error(tres.statusCode + ' from idp, body: ' + JSON.stringify(tbody)));

    var accessToken = tbody.access_token;
    var usersMeOptions = {
      url: IDP_USERS_ME_URL,
      json: true,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    };

    request.get(usersMeOptions, function(err, ures, user) {
      if (err) return next(err);
      if (ures.statusCode !== 200) return next(new Error(ures.statusCode + ' from idp, WWW-Authenticate: ' + JSON.stringify(ures.headers['www-authenticate'])));

      req.authSession.profile = {
        email: user.email,
        name: user.name,
        countryCode: user.countryCode,
      };
      req.authSession.signed_in = true;

      log.info('successfully logged user in', req.authSession.profile);
      var redirect = '/admin';
      if (req.authSession.redirectAfterLogin) {
        redirect = req.authSession.redirectAfterLogin;
        delete req.authSession.redirectAfterLogin;
      }
      log.info('redirecting back to', redirect);
      res.redirect(redirect);
    });
  });
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
