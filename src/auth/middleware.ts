/// <reference path="../../.types/node/node.d.ts" />

import express = require('express');
import model = require('./model');

var util = require('util'),
    qs = require('querystring');

function getUser(req) {
  return new model.User(
    req.authSession.profile.email,
    req.authSession.profile.name,
    req.authSession.profile.countryCode
  );
}

export function requireAuthCookieOrRedirect(req, res, next) {
  if (req['authSession'].signed_in !== true) {
    var url = util.format('/login?redirect=%s', qs.escape(req.path));
    return res.redirect(url);
  }
  res.locals.user = getUser(req);
  res.locals.signOutCsrfToken = req.authSession.signOutCsrfToken;
  next();
}

export function requireAuthOrDeny(req, res, next) {
  if (req['authSession'].signed_in !== true) {
    //var apiToken = req.get('X-API-Token');
    res.send(401);
  }
  next();
}
