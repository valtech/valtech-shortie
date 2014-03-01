/// <reference path="../../.types/node.d.ts" />
/// <reference path="../../.types/express.d.ts" />

import express = require('express');

function index(req, res) {
  res.render('index');
}
function admin(req, res) {
  res.render('admin');
}

export function setup(app: express.Application): void {
  app.get('/', index);
  app.get('/admin', admin);
}
