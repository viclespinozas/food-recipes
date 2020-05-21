const Ingredient = require('../models/ingredient');

module.exports = {
    async ingredientIndex(req, res, next) {
        // const ingredients = await Ingredient.find({}).sort('-_id').exec();
        // const recentIngredients = ingredients.slice(0,5);
        const { dbQuery } = res.locals;
        let ingredients = await Ingredient.paginate(dbQuery, {
           page: req.query.page || 1,
           limit: 2,
           sort: {
               '_id': -1
           }
        });
        ingredients.page = Number(ingredients.page);
        if (!ingredients.docs.length && res.locals.query) {
            res.locals.error = "No results match that query.";
        }
        res.render('ingredients/index', {
            ingredients: ingredients
        });
    },

    ingredientNew(req, res, next) {
        res.render('ingredients/new');
    },

    async ingredientCreate(req, res, next) {
        const data = {
            title: req.body.title
        }
        let ingredient = new Ingredient(data);
        await ingredient.save();
        req.session.success = 'Ingredient created successfully!';
        res.redirect(`/ingredients/${ingredient.id}`);
    },

    async ingredientShow(req, res, next) {
        let ingredient = await Ingredient.findById(req.params.id);
        res.render('ingredients/show', { ingredient });
    },

    async ingredientEdit(req, res, next) {
        let ingredient = await Ingredient.findById(req.params.id);
        res.render('ingredients/edit', { ingredient });
    },

    async ingredientUpdate(req, res, next) {
        const ingredient = await Ingredient.findById(req.params.id);
        ingredient.title = req.body.title;
        await ingredient.save();

        req.session.success = 'Ingredient updated successfully!';
        res.redirect(`/ingredients/${ingredient.id}`);
    }
}