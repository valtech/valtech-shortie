/// <reference path="../../.types/node/node.d.ts" />
/// <reference path="../../.types/express/express.d.ts" />

import express = require('express');

function index(req: express.Request, res: express.Response, next) {
  if (req.accepts('text/html')) {
    res.render('index');
  }
  else {
    next();
  }
}

export function setup(app: express.Application): void {
  app.get('/', index);
}
