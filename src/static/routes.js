function index(req, res, next) {
    if (req.accepts('text/html')) {
        console.log('rendering index');
        res.render('index');
    } else {
        console.log('passing to next middleware');
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
