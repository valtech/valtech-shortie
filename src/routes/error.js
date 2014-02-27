/// <reference path="../../types/node/node.d.ts" />
/// <reference path="../../types/express/express.d.ts" />
function handleError(err, req, res, next) {
    if (req.accepts('html')) {
        res.status(500).render('500');
    } else {
        res.send(500, { error: 'internal server error' });
    }
}
exports.handleError = handleError;

function handleNotFound(req, res) {
    if (req.accepts('html')) {
        res.status(404).render('404');
    } else {
        res.send(404, { error: 'not found' });
    }
}

function setup(app) {
    app.all('*', handleNotFound);
}
exports.setup = setup;
