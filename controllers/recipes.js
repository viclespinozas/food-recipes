const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const Measurement = require('../models/measurement');
const IngredientMeasurement = require('../models/ingredient-measurement');
const IngredientMeasurementConversion = require('../models/ingredient-measurement-conversions');
const Fraction = require('fraction.js');

const recipeMethods = {
    recipeIndex: async function(req, res, next) {
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
            res.locals.error = "No has creado recetas todavía!.";
        }
        res.render('recipes/index', {
            recipes: recipes
        });
    },

    recipeNew: async function(req, res, next) {
        const ingredients = await Ingredient.find().populate('processType');
        const measurements = await Measurement.find();
        res.render('recipes/new', {
            ingredients,
            measurements
        });
    },

    recipeCreate: async function(req, res, next) {
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
            for (const recipeIngredient of ingredientMeasurementList) {
                let imData = {
                    ingredient: recipeIngredient.ingredient,
                    measurement: recipeIngredient.measurement,
                    weight: recipeIngredient.weight
                }

                let ingredientMeasurement = new IngredientMeasurement(imData);
                ingredientMeasurement.recipe = recipe.id;

                ingredientMeasurement = await recipeMethods.createIngredientConversion(ingredientMeasurement);
                await ingredientMeasurement.save();

                recipe.ingredientsMeasurements.push(ingredientMeasurement);
            }

            await recipe.save();
            req.session.success = 'Receta creada satisfactoriamente!.';
            res.redirect(`/recipes/${recipe.id}`);
        }
    },

    recipeShow: async function(req, res, next) {
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
                },
                {
                    path: 'ingredientMeasurementConversion',
                    model: 'IngredientMeasurementConversion'
                }
            ]
        });

        res.render('recipes/show', { recipe });
    },

    recipeEdit: async function(req, res, next) {
        const ingredients = await Ingredient.find().populate('processType');
        const measurements = await Measurement.find();
        let recipe = await Recipe.findById(req.params.id).populate({
            path: 'ingredientsMeasurements',
            options: { sort: { '_id': -1 } },
            populate: [
                {
                    path: 'ingredient',
                    model: 'Ingredient',
                    populate: [
                        {
                            path: 'processType',
                            model: 'ProcessType'
                        }
                    ]
                },
                {
                    path: 'measurement',
                    model: 'Measurement'
                },
                {
                    path: 'ingredientMeasurementConversion',
                    model: 'IngredientMeasurementConversion'
                }
            ]
        });
        let ingredientsMeasurementsList = [];
        if (recipe) {
            recipe.ingredientsMeasurements.forEach(ingredientMeasurement => {
               let dataChild = {
                   ingredient: ingredientMeasurement.ingredient.id,
                   measurement: ingredientMeasurement.measurement.id,
                   weight: ingredientMeasurement.weight
               }
                ingredientsMeasurementsList.push(dataChild);
            });
        }
        res.render('recipes/edit', {
            recipe,
            ingredients,
            measurements,
            ingredientsMeasurementsList
        });
    },

    recipeUpdate: async function (req, res, next) {
        let recipe = await Recipe.findById(req.params.id);
        recipe.ingredientsMeasurements.forEach(ingredientMeasurement => {
            recipe.ingredientsMeasurements.remove(ingredientMeasurement);
        });
        await IngredientMeasurement.remove({recipe: req.params.id}).exec();

        recipe.title = req.body.title;
        recipe.preparation = req.body.preparation;

        const ingredientMeasurementList = JSON.parse(req.body.ingredientsMeasurements);
        for (const recipeIngredient of ingredientMeasurementList) {
            let imData = {
                ingredient: recipeIngredient.ingredient,
                measurement: recipeIngredient.measurement,
                weight: recipeIngredient.weight
            }

            let ingredientMeasurement = new IngredientMeasurement(imData);
            ingredientMeasurement.recipe = recipe.id;

            ingredientMeasurement = await recipeMethods.createIngredientConversion(ingredientMeasurement);
            await ingredientMeasurement.save();

            recipe.ingredientsMeasurements.push(ingredientMeasurement);
        }

        await recipe.save();

        req.session.success = 'Receta actualizada satisfactoriamente!';
        res.redirect(`/recipes/${recipe.id}`);
    },

    recipeDestroy: async function(req, res, next) {
        let recipe = await Recipe.findByIdAndRemove(req.params.id).exec();
        recipe.ingredientsMeasurements.forEach(ingredientMeasurement => {
            recipe.ingredientsMeasurements.remove(ingredientMeasurement);
        });
        await IngredientMeasurement.remove({recipe: req.params.id}).exec();
        req.session.success = 'Receta eliminada satisfactoriamente!';
        res.redirect('/recipes');
    },

    createIngredientConversion: async function (ingredientMeasurement) {
        const measurement = await Measurement.findById(ingredientMeasurement.measurement);
        const weight = ingredientMeasurement.weight;
        const ingredient = await Ingredient.findById(ingredientMeasurement.ingredient)
            .populate('measurementCategory')
            .exec();

        let ingredientMeasurementConversion = new IngredientMeasurementConversion();
        ingredientMeasurementConversion.ingredientMeasurement = ingredientMeasurement.id;

        if (measurement.codeName == "grs") {
            ingredientMeasurementConversion.grams = weight;
            const grsWeight = (ingredient.measurementCategory) ? ingredient.measurementCategory.weight : 130;

            /* CUP CONVERSION */
            let cupFractionValue = new Fraction(weight / grsWeight) ;
            let cupValue = weight / grsWeight;
            ingredientMeasurementConversion.cup = cupFractionValue.toFraction(true);
            /* END OF CUP CONVERSION */

            /* ML CONVERSION */
            let mlValue = cupValue * 240;
            mlValue = (Math.round(mlValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.milliliters = mlValue;
            /* END OF ML CONVERSION */

            /* POUND CONVERSION */
            let pndValue = weight / 454;
            pndValue = (Math.round(pndValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.pound = pndValue;
            /* END OF POUND CONVERSION */

            /* OUNCE CONVERSION */
            let ozValue = weight / 25.2;
            ozValue = (Math.round(ozValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.ounce = ozValue;
            /* END OF OUNCE CONVERSION */

            /* TBSP CONVERSION */
            let tbspValue = cupValue * 16;
            ingredientMeasurementConversion.tablespoon = tbspValue;
            /* END OF TBSP CONVERSION */

            /* TSP CONVERSION */
            let tspValue = cupValue * 48;
            ingredientMeasurementConversion.teaspoonful = tspValue;
            /* END OF TSP CONVERSION */
        } else if (measurement.codeName == "ml") {
            ingredientMeasurementConversion.milliliters = weight;

            /* GRS CONVERSION */
            let grsValue = (weight * 130) / 240;
            grsValue = (Math.round(grsValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.grams = grsValue;
            /* END OF GRS CONVERSION */

            /* CUP CONVERSION */
            let cupFractionValue = new Fraction(weight / 240) ;
            let cupValue = weight / 240 ;
            ingredientMeasurementConversion.cup = cupFractionValue.toFraction(true);
            /* END OF CUP CONVERSION */

            /* POUND CONVERSION */
            let pndValue = grsValue / 454;
            pndValue = (Math.round(pndValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.pound = pndValue;
            /* END OF POUND CONVERSION */

            /* OUNCE CONVERSION */
            let ozValue = grsValue / 25.2;
            ozValue = (Math.round(ozValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.ounce = ozValue;
            /* END OF OUNCE CONVERSION */

            /* TBSP CONVERSION */
            let tbspValue = (weight * 16) / 240;
            ingredientMeasurementConversion.tablespoon = tbspValue;
            /* END OF TBSP CONVERSION */

            /* TSP CONVERSION */
            let tspValue = (weight * 48) / 240;
            ingredientMeasurementConversion.teaspoonful = tspValue;
            /* END OF TSP CONVERSION */
        } else if (measurement.codeName == "cup") {
            ingredientMeasurementConversion.cup = weight;
            const grsWeight = (ingredient.measurementCategory) ? ingredient.measurementCategory.weight : 130;

            /* GRS CONVERSION */
            let grsValue = weight * grsWeight ;
            ingredientMeasurementConversion.grams = grsValue;
            /* END OF GRS CONVERSION */

            /* ML CONVERSION */
            let mlValue = weight * 240;
            mlValue = (Math.round(mlValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.milliliters = mlValue;
            /* END OF ML CONVERSION */

            /* POUND CONVERSION */
            let pndValue = grsValue / 454;
            pndValue = (Math.round(pndValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.pound = pndValue;
            /* END OF POUND CONVERSION */

            /* OUNCE CONVERSION */
            let ozValue = grsValue / 25.2;
            ozValue = (Math.round(ozValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.ounce = ozValue;
            /* END OF OUNCE CONVERSION */

            /* TBSP CONVERSION */
            let tbspValue = weight * 16;
            ingredientMeasurementConversion.tablespoon = tbspValue;
            /* END OF TBSP CONVERSION */

            /* TSP CONVERSION */
            let tspValue = weight * 48;
            ingredientMeasurementConversion.teaspoonful = tspValue;
            /* END OF TSP CONVERSION */
        } else if (measurement.codeName == "pnd") {
            ingredientMeasurementConversion.pound = weight;
            const grsWeight = (ingredient.measurementCategory) ? ingredient.measurementCategory.weight : 130;

            /* GRS CONVERSION */
            let grsValue = weight * 454;
            ingredientMeasurementConversion.grams = grsValue;
            /* END OF GRS CONVERSION */

            /* CUP CONVERSION */
            let cupFractionValue = new Fraction(grsValue / grsWeight) ;
            let cupValue = grsValue / grsWeight ;
            ingredientMeasurementConversion.cup = cupFractionValue.toFraction(true);
            /* END OF CUP CONVERSION */

            /* ML CONVERSION */
            let mlValue = cupValue * 240;
            mlValue = (Math.round(mlValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.milliliters = mlValue;
            /* END OF ML CONVERSION */

            /* OUNCE CONVERSION */
            let ozValue = grsValue / 25.2;
            ozValue = (Math.round(ozValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.ounce = ozValue;
            /* END OF OUNCE CONVERSION */

            /* TBSP CONVERSION */
            let tbspValue = cupValue * 16;
            tbspValue = (Math.round(tbspValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.tablespoon = tbspValue;
            /* END OF TBSP CONVERSION */

            /* TSP CONVERSION */
            let tspValue = cupValue * 48;
            tspValue = (Math.round(tspValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.teaspoonful = tspValue;
            /* END OF TSP CONVERSION */
        } else if (measurement.codeName == "oz") {
            ingredientMeasurementConversion.ounce = weight;
            const grsWeight = (ingredient.measurementCategory) ? ingredient.measurementCategory.weight : 130;

            /* GRS CONVERSION */
            let grsValue = weight * 25.2;
            ingredientMeasurementConversion.grams = grsValue;
            /* END OF OUNCE CONVERSION */

            /* CUP CONVERSION */
            let cupFractionValue = new Fraction(grsValue / grsWeight) ;
            let cupValue = grsValue / grsWeight ;
            ingredientMeasurementConversion.cup = cupFractionValue.toFraction(true);
            /* END OF CUP CONVERSION */

            /* ML CONVERSION */
            let mlValue = cupValue * 240;
            mlValue = (Math.round(mlValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.milliliters = mlValue;
            /* END OF ML CONVERSION */

            /* POUND CONVERSION */
            let pndValue = grsValue / 454;
            pndValue = (Math.round(pndValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.pound = pndValue;
            /* END OF POUND CONVERSION */

            /* TBSP CONVERSION */
            let tbspValue = cupValue * 16;
            tbspValue = (Math.round(tbspValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.tablespoon = tbspValue;
            /* END OF TBSP CONVERSION */

            /* TSP CONVERSION */
            let tspValue = cupValue * 48;
            tspValue = (Math.round(tspValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.teaspoonful = tspValue;
            /* END OF TSP CONVERSION */
        } else if (measurement.codeName == "tbsp") {
            ingredientMeasurementConversion.tablespoon = weight;
            const grsWeight = (ingredient.measurementCategory) ? ingredient.measurementCategory.weight : 130;

            /* GRS CONVERSION */
            let grsValue = (weight * grsWeight) / 16;
            grsValue = (Math.round(grsValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.grams = grsValue;
            /* END OF TBSP CONVERSION */

            /* CUP CONVERSION */
            let cupFractionValue = new Fraction(grsValue / grsWeight) ;
            let cupValue = grsValue / grsWeight ;
            ingredientMeasurementConversion.cup = cupFractionValue.toFraction(true);
            /* END OF CUP CONVERSION */

            /* ML CONVERSION */
            let mlValue = cupValue * 240;
            mlValue = (Math.round(mlValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.milliliters = mlValue;
            /* END OF ML CONVERSION */

            /* POUND CONVERSION */
            let pndValue = grsValue / 454;
            pndValue = (Math.round(pndValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.pound = pndValue;
            /* END OF POUND CONVERSION */

            /* OUNCE CONVERSION */
            let ozValue = grsValue / 25.2;
            ozValue = (Math.round(ozValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.ounce = ozValue;
            /* END OF OUNCE CONVERSION */

            /* TSP CONVERSION */
            let tspValue = weight * 3;
            ingredientMeasurementConversion.teaspoonful = tspValue;
            /* END OF TSP CONVERSION */
        } else if (measurement.codeName == "tsp") {
            ingredientMeasurementConversion.teaspoonful = weight;
            const grsWeight = (ingredient.measurementCategory) ? ingredient.measurementCategory.weight : 130;

            /* GRS CONVERSION */
            let grsValue = (weight * grsWeight) / 48;
            grsValue = (Math.round(grsValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.grams = grsValue;
            /* END OF TBSP CONVERSION */

            /* CUP CONVERSION */
            let cupFractionValue = new Fraction(grsValue / grsWeight) ;
            let cupValue = grsValue / grsWeight ;
            ingredientMeasurementConversion.cup = cupFractionValue.toFraction(true);
            /* END OF CUP CONVERSION */

            /* ML CONVERSION */
            let mlValue = cupValue * 240;
            mlValue = (Math.round(mlValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.milliliters = mlValue;
            /* END OF ML CONVERSION */

            /* POUND CONVERSION */
            let pndValue = grsValue / 454;
            pndValue = (Math.round(pndValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.pound = pndValue;
            /* END OF POUND CONVERSION */

            /* OUNCE CONVERSION */
            let ozValue = grsValue / 25.2;
            ozValue = (Math.round(ozValue * 100) / 100).toFixed(2);
            ingredientMeasurementConversion.ounce = ozValue;
            /* END OF OUNCE CONVERSION */

            /* TBSP CONVERSION */
            let tbspFractionValue = new Fraction(weight / 3) ;
            let tbspValue = weight / 3;
            ingredientMeasurementConversion.tablespoon = tbspFractionValue.toFraction(true);
            /* END OF TBSP CONVERSION */
        }

        await ingredientMeasurementConversion.save();
        ingredientMeasurement.ingredientMeasurementConversion = ingredientMeasurementConversion.id;
        return ingredientMeasurement;
    }
}

module.exports = recipeMethods;