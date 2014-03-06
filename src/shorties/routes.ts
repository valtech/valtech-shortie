/// <reference path="../../.types/express/express.d.ts" />

import express = require('express');


export function getHandler(req, res, next) {
  if (req.params.slug == 'cats') {
    res.redirect('http://icanhazcheezburger.com/');
    return;
  }
  next();
}

function postHandler(req, res, next) {
  // require auth
  // add new shortie with generated slug
  // return 200 and shortie entity in body on success
  // return 400 on invalid data
  next();
}

function putHandler(req, res, next) {
  // require auth
  // update slug or add shortie with specified slug
  // return 400 on slug/shortUrl mismatch
  // return shortie entity in body on success
}

function deleteHandler(req, res, next) {
  // require auth
  // delete shortie
  // only returns 200 or 404
}

export function setup(app: express.Application): void {
  app.get('/:slug', getHandler);
  app.post('/', postHandler);
  app.put('/:slug', putHandler);
  app.del('/:slug', deleteHandler);
}