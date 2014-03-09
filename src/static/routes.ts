/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />

import express = require('express');

function index(req: express.Request, res: express.Response, next) {
  if (req.accepts('text/html')) {
    console.log('rendering index');
    res.render('index');
  }
  else {
    console.log('passing to next middleware');
    next();
  }
}
function admin(req, res) {
  res.render('admin');
}

export function setup(app: express.Application): void {
  app.get('/', index);
  app.get('/admin', admin);
}
