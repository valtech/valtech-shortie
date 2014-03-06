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
    next();
}

function putHandler(req, res, next) {
}

function deleteHandler(req, res, next) {
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
