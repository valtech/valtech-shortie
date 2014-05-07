/// <reference path="../../.types/node/node.d.ts" />

import express = require('express');
import model = require('./model');

var util = require('util'),
    qs = require('querystring');

function getUser(req) {
  return new model.User(
    req.authSession.profile.username,
    req.authSession.profile.name,
    req.authSession.profile.email
  );
}

export function requireAuthCookieOrRedirect(req, res, next) {
  if (req['authSession'].signed_in !== true) {
    var url = util.format('/login?redirect=%s', qs.escape(req.path));
    return res.redirect(url);
  }
  res.locals.user = getUser(req);
  next();
}

export function requireAuthOrDeny(req, res, next) {
  if (req['authSession'].signed_in !== true) {
    //var apiToken = req.get('X-API-Token');
    res.send(401);
  }
  next();
}
