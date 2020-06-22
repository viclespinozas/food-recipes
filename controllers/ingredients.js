const Ingredient = require('../models/ingredient');
const Categories = require('../models/category');
const ProcessTypes = require('../models/process-type');
const MeasurementCategory = require('../models/measurement-category');

module.exports = {
    async ingredientIndex(req, res, next) {
        const { dbQuery } = res.locals;
        let ingredients = await Ingredient.paginate(dbQuery, {
            page: req.query.page || 1,
            limit: 10,
            populate: [
                {
                    path: 'categories',
                    select: 'title',
                    model:'Category',
                },
                {
                    path: 'processType',
                    select: 'title',
                    model: 'ProcessType'
                },
                {
                    path: 'measurementCategory',
                    select: 'ingredient',
                    model: 'MeasurementCategory'
                }
            ],
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

    async ingredientNew(req, res, next) {
        const categories = await Categories.find();
        const processTypes = await ProcessTypes.find();
        const measurementCategories = await MeasurementCategory.find();
        res.render('ingredients/new', {
            categories,
            processTypes,
            measurementCategories
        });
    },

    async ingredientCreate(req, res, next) {
        const data = {
            title: req.body.title,
            categories: req.body.categories,
            processType: req.body.processType,
            measurementCategory: req.body.measurementCategory
        }

        let persistedIngredient = await Ingredient.findOne({
            title: req.body.title
        });

        if (persistedIngredient !== null) {
            req.session.error = 'There is an existent ingredient with the given name.';
            res.redirect('back');
        } else {
            let ingredient = new Ingredient(data);
            await ingredient.save();
            req.session.success = 'Ingredient created successfully!';
            res.redirect('/ingredients');
        }
    },

    async ingredientShow(req, res, next) {
        let ingredient = await Ingredient.findById(req.params.id);
        res.render('ingredients/show', { ingredient });
    },

    async ingredientEdit(req, res, next) {
        let ingredient = await Ingredient.findById(req.params.id)
            .populate('categories')
            .populate('processTypes')
            .populate('measurementCategory')
            .exec();
        const categories = await Categories.find();
        const processTypes = await ProcessTypes.find();
        const measurementCategories = await MeasurementCategory.find();
        res.render('ingredients/edit', {
            ingredient,
            categories,
            processTypes,
            measurementCategories
        });
    },

    async ingredientUpdate(req, res, next) {
        const ingredient = await Ingredient.findById(req.params.id);
        ingredient.title = req.body.title;
        ingredient.categories = req.body.categories;
        ingredient.processType = req.body.processType;
        ingredient.measurementCategory = req.body.measurementCategory;
        await ingredient.save();

        req.session.success = 'Ingredient updated successfully!';
        res.redirect('/ingredients');
    },

    async ingredientDestroy(req, res, next) {
        await Ingredient.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Ingredient deleted successfully!';
        res.redirect('/ingredients');
    }
}