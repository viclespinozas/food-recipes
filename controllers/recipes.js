const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const Measurement = require('../models/measurement');
const IngredientMeasurement = require('../models/ingredient-measurement');

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
        const measurements = await Measurement.find();
        res.render('recipes/new', {
            ingredients,
            measurements
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
            let data = {
                title: req.body.title,
                preparation: req.body.preparation
            }
            let recipe = new Recipe(data);
            await recipe.save();

            let ingredientMeasurementList = JSON.parse(req.body.ingredientsMeasurements);
            ingredientMeasurementList.forEach(recipeIngredient => {
                let imData = {
                    ingredient: recipeIngredient.ingredient,
                    measurement: recipeIngredient.measurement,
                    weight: recipeIngredient.weight
                }

                let ingredientMeasurement = new IngredientMeasurement(imData);
                ingredientMeasurement.save();

                recipe.ingredientsMeasurements.push(ingredientMeasurement);
            });

            await recipe.save();
            req.session.success = 'Recipe created successfully!.';
            res.redirect(`/recipes/${recipe.id}`);
        }
    },

    async recipeShow(req, res, next) {
        let recipe = await Recipe.findById(req.params.id).populate({
            path: 'ingredientsMeasurements',
            options: { sort: { '_id': -1 } },
            populate: [
                {
                    path: 'ingredient',
                    model: 'Ingredient'
                },
                {
                    path: 'measurement',
                    model: 'Measurement'
                }
            ]
        });

        res.render('recipes/show', { recipe });
    },

    async recipeEdit(req, res, next) {
        const ingredients = await Ingredient.find();
        const measurements = await Measurement.find();
        let recipe = await Recipe.findById(req.params.id).populate({
            path: 'ingredientsMeasurements',
            options: { sort: { '_id': -1 } },
            populate: [
                {
                    path: 'ingredient',
                    model: 'Ingredient'
                },
                {
                    path: 'measurement',
                    model: 'Measurement'
                }
            ]
        });
        res.render('recipes/edit', {
            recipe,
            ingredients,
            measurements
        });
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