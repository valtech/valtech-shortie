/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />

import express = require('express');
import authMiddleware = require('../auth/middleware');

function index(req: express.Request, res: express.Response, next) {
  if (req.accepts('text/html')) {
    res.render('index');
  }
  else {
    next();
  }
}

function admin(req, res) {
  res.render('admin');
}

function list(req, res) {
  res.render('list');
}

export function setup(app: express.Application): void {
  app.get('/', index);
  app.get('/admin', authMiddleware.requireAuthCookieOrRedirect, admin);
  app.get('/admin/list', authMiddleware.requireAuthCookieOrRedirect, list);
}
