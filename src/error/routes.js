/// <reference path="../../.types/node.d.ts" />
/// <reference path="../../.types/express.d.ts" />
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
