var slugGenerator = require('../lib/SlugGenerator');

var repo;

function getHandler(req, res, next) {
    repo.getShortieBySlug(req.params.slug, function (err, shortie) {
        if (err || !shortie)
            return next();
        res.redirect(shortie.url);
    });
}

function listHandler(req, res, next) {
    repo.getAllShorties(function (err, shorties) {
        if (err)
            return next(err);
        res.send(200, shorties);
    });
}

function postHandler(req, res, next) {
    var url = req.body.url;
    if (!url || url.length === 0) {
        return res.send(400, 'No URL in request body');
    }

    var slug = slugGenerator.generate();
    var shortie = {
        slug: slug,
        url: url
    };
    repo.addShortie(shortie, function (err) {
        if (err)
            return next(err);
        res.send(201, shortie);
    });
}

function putHandler(req, res, next) {
}

function deleteHandler(req, res, next) {
}

function setup(app, options) {
    repo = options.shortiesRepo;

    app.get('/shorties', listHandler);
    app.get('/:slug', getHandler);
    app.post('/', postHandler);
    app.put('/:slug', putHandler);
    app.del('/:slug', deleteHandler);
}
exports.setup = setup;
