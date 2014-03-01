/// <reference path="../../.types/node.d.ts" />
/// <reference path="../../.types/express.d.ts" />

import express = require('express');

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