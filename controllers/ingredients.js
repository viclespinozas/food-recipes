const Ingredient = require('../models/ingredient');

module.exports = {
    async ingredientIndex(req, res, next) {
        const ingredients = await Ingredient.find({}).sort('-_id').exec();
        const recentIngredients = ingredients.slice(0,5);
        res.render('ingredients/index', {
            ingredients,
            recentIngredients
        });
    },

    ingredientNew(req, res, next) {
        res.render('ingredients/new');
    },

    async ingredientCreate(req, res, next) {
        let ingredient = new Ingredient(req.body.ingredient);
        await ingredient.save();
        req.session.success = 'Ingredient created successfully!';
        res.redirect(`/ingredients/${ingredient.id}`);
    },

    async ingredientShow(req, res, next) {
        let ingredient = await Ingredient.findById(req.params.id);
        res.render('ingredients/show', { ingredient });
    }
}