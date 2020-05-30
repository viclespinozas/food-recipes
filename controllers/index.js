module.exports = {
    landingPage(req, res, next) {
        res.render('index', {
            title: 'Food Recipes VIYI'
        });
    }
}