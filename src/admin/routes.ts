/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />

import express = require('express');
import authMiddleware = require('../auth/middleware');

function admin(req, res) {
  res.render('admin/index');
}

function list(req, res) {
  res.render('admin/list');
}

export function setup(app: express.Application): void {
  app.get('/admin', authMiddleware.requireAuthCookieOrRedirect, admin);
  app.get('/admin/list', authMiddleware.requireAuthCookieOrRedirect, list);
}
