function index(req, res, next) {
    if (req.accepts('text/html')) {
        res.render('index');
    } else {
        next();
    }
}

function admin(req, res) {
    res.render('admin');
}

function setup(app) {
    app.get('/', index);
    app.get('/admin', admin);
}
exports.setup = setup;
