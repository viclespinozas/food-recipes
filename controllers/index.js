module.exports = {
    landingPage(req, res, next) {
        res.render('index', {
            title: 'Recetas de Comidas VIYI'
        });
    }
}