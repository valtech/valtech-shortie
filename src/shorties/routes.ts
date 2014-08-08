/// <reference path="../../.types/express/express.d.ts" />

import model = require('./model');
import express = require('express');
import slugGenerator = require('../lib/SlugGenerator');
import authMiddleware = require('../auth/middleware');
import validation = require('./validation');
var log = require('../log');

var repo;

function getHandler(req, res, next) {
  repo.getShortieBySlug(req.params.slug, function (err, shortie) {
    if (err || !shortie) return next();
    if(req.query.noRedirect) {
      res.send(200, shortie);
    } else {
      // Important: Do a 301 Moved Permanently redirect to allow SEO rankings etc.
      // to propagate correctly to the target site.
      res.redirect(301, shortie.url);
    }
  });
}

function listHandler(req, res, next) {
  log.info('Will fetch list of shorties from repository');
  var opts = { query: {}, sort: null };
  if (req.query.query)
    opts.query = JSON.parse(req.query.query) || {};
  opts.sort = {
    'lastModifiedTimestamp': -1
  };
  repo.getAllShorties(opts, function (err, shorties) {
    if (err) return next(err);
    log.info('Fetched ' + shorties.length + ' shorties from repository');
    res.send(200, shorties);
  });
  return;
}

function postHandler(req, res, next) {
  // return 400 on invalid data
  var url = req.body.url;
  if (validation.isInvalidUrl(url)) {
    log.warn('Invalid URL in request body. Was: ' + url);
    return res.send(400, 'Invalid URL.');
  }

  repo.getShortiesByUrl(url, function(err, shorties) {
    if (err) return next(err);
    if(shorties.length === 0) {
      var slug = slugGenerator.generate();
      var shortie = new model.Shortie(slug, url, model.ShortieType.Generated, new Date().getTime(), req.authSession.profile);
      repo.addShortie(shortie.slug, shortie, function(err) {
        if (err) return next(err);
        res.send(201, shortie);
      });
    } else {
      res.send(200, new model.Shortie(shorties[0].slug, shorties[0].url, shorties[0].type, shorties[0].lastModifiedTimestamp, shorties[0].lastModifiedBy));
    }
  });
}

function putHandler(req, res, next) {
  var url = req.body.url;
  if (validation.isInvalidUrl(url)) {
    log.warn('Invalid URL in request body. Was: ' + url);
    return res.send(400, 'Invalid URL.');
  }

  var slugToCreateOrReplace = req.params.slug;
  if (validation.isInvalidSlug(slugToCreateOrReplace)) {
    log.error('Invalid slug in request URL. Was: ' + slugToCreateOrReplace);
    return res.send(400, 'Invalid slug.');
  }
  if (validation.isBlacklistedSlug(slugToCreateOrReplace)) {
    log.error('Blacklisted slug in request URL. Was: ' + slugToCreateOrReplace);
    return res.send(400, 'Sorry, that slug is not allowed.');
  }

  var newSlug = req.body.slug;
  if (validation.isInvalidSlug(newSlug)) {
    log.error('Invalid slug in request body. Was: ' + slugToCreateOrReplace);
    return res.send(400, 'Invalid slug.');
  }
  if (validation.isBlacklistedSlug(newSlug)) {
    log.error('Blacklisted slug in request body. Was: ' + slugToCreateOrReplace);
    return res.send(400, 'Sorry, that slug is not allowed.');
  }

  var type: model.ShortieType;
  if(slugToCreateOrReplace !== newSlug)
    type = model.ShortieType.Manual;
  else
    type = req.body.type;

  var shortie = new model.Shortie(newSlug , url, type, new Date().getTime(), req.authSession.profile);

  repo.addShortie(slugToCreateOrReplace, shortie, function(err) {
    if (err) return next(err);
    res.send(201, shortie);
  });
}

function deleteHandler(req, res, next) {
  var slug = req.params.slug;
  if (validation.isInvalidSlug(slug)) return res.send(400, 'Invalid slug in request body');

  repo.removeShortie(slug, function(err, numRemoved) {
    if (err) return next(err);
    if (numRemoved != 1) return res.send(404, 'Shortie not found');
    res.send(200, 'Shortie removed');
  });
}

export function setup(app: express.Application, options: any): void {
  repo = options.shortiesRepo;

  app.get('/api/shorties', authMiddleware.requireAuthOrDeny, listHandler);
  app.get('/:slug', getHandler);
  app.post('/api/shorties', authMiddleware.requireAuthOrDeny, postHandler);
  app.put('/api/shorties/:slug', authMiddleware.requireAuthOrDeny, putHandler);
  app.del('/api/shorties/:slug', authMiddleware.requireAuthOrDeny, deleteHandler);
}
