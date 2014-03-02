function index(req, res) {
    res.render('index');
}
function admin(req, res) {
    res.render('admin');
}

function setup(app) {
    app.get('/', index);
    app.get('/admin', admin);
}
exports.setup = setup;
