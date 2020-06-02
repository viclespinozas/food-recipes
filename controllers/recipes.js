const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');

module.exports = {
    async recipeIndex(req, res, next) {
        const { dbQuery } = res.locals;
        let recipes = await Recipe.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 10,
            sort: {
                '_id': -1
            }
        });
        recipes.page = Number(recipes.page);
        if (!recipes.docs.length && res.locals.query) {
            res.locals.error = "You have not created recipes yet!.";
        }
        res.render('recipes/index', {
            recipes: recipes
        });
    },

    async recipeNew(req, res, next) {
        const ingredients = await Ingredient.find();
        res.render('recipes/new', {
            ingredients: ingredients
        });
    },

    async recipeCreate(req, res, next) {
        let persistedRecipe = await Recipe.findOne({
           title: req.body.title
        });

        if (persistedRecipe !== null) {
            req.session.error = "Ya existe una receta con el nombre indicado.";
            res.redirect('back');
        } else {
            let recipe = new Recipe(req.body);
            await recipe.save();
            req.session.success = 'Recipe created successfully!.';
            res.redirect(`/recipes/${recipe.id}`);
        }
    },

    async recipeShow(req, res, next) {
        let recipe = await Recipe.findById(req.params.id).populate('ingredients');
        res.render('recipes/show', { recipe });
    },

    async recipeEdit(req, res, next) {
        const ingredients = await Ingredient.find();
        let recipe = await Recipe.findById(req.params.id).populate('ingredients');
        res.render('recipes/edit', { recipe, ingredients });
    },

    async recipeUpdate(req, res, next) {
        let recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body);
        await recipe.save();

        req.session.success = 'Recipe updated successfully!';
        res.redirect(`/recipes/${recipe.id}`);
    },

    async recipeDestroy(req, res, next) {
        await Recipe.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Recipe deleted successfully!';
        res.redirect('/recipes');
    }
}