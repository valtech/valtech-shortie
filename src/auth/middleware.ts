/// <reference path="../../.types/node/node.d.ts" />

import express = require('express');
var util = require('util'),
    qs = require('querystring');

export function requireAuthCookieOrRedirect(req, res, next) {
  if (req['authSession'].signed_in !== true) {
    var url = util.format('/login?redirect=%s', qs.escape(req.path));
    return res.redirect(url);
  }
  next();
}

export function requireAuthOrDeny(req, res, next) {
  if (req['authSession'].signed_in !== true) {
    //var apiToken = req.get('X-API-Token');
    res.send(401);
  }
  next();
}