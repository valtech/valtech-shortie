﻿/// <reference path="../../.types/express/express.d.ts" />
/// <reference path="../config.d.ts" />
var dbConfig;

function getHandler(req, res, next) {
    if (req.params.slug == 'cats') {
        res.redirect('http://icanhazcheezburger.com/');
        return;
    }
    next();
}
exports.getHandler = getHandler;

function postHandler(req, res, next) {
    // require auth
    // add new redirect with generated slug
    // return 200 and redirect entity in body on success
    // return 400 on invalid data
    next();
}

function putHandler(req, res, next) {
    // require auth
    // update slug or add redirect with specified slug
    // return 400 on slug/shortUrl mismatch
    // return redirect entity in body on success
}

function deleteHandler(req, res, next) {
    // require auth
    // delete redirect
    // only returns 200 or 404
}

function setup(app, config) {
    app.get('/:slug', exports.getHandler);
    app.post('/', postHandler);
    app.put('/:slug', putHandler);
    app.del('/:slug', deleteHandler);
    if (config)
        dbConfig = config.db;
}
exports.setup = setup;
