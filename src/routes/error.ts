/// <reference path="../../types/node/node.d.ts" />
/// <reference path="../../types/express/express.d.ts" />

import express = require('express');

export function handleError(err, req, res, next) {
  if (req.accepts('html')) {
    res
      .status(500)
      .render('500');
  } else {
    res.send(500, { error: 'internal server error' });
  }
}

function handleNotFound(req, res) {
  if (req.accepts('html')) {
    res
      .status(404)
      .render('404');
  } else {
    res.send(404, { error: 'not found' });
  }
}

export function setup(app: express.Application): void {
  app.all('*', handleNotFound);
}