const Ingredient = require('../models/ingredient');
const Categories = require('../models/category');
const ProcessTypes = require('../models/process-type');
const MeasurementCategory = require('../models/measurement-category');
const { cloudinary } = require('../cloudinary');
const crypto = require('crypto');

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
            res.locals.error = "No hay ingredientes creados todavía";
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
        if (req.file) {
            const { secure_url, public_id } = req.file;
            req.body.image = {
                secure_url,
                public_id
            }
        }

        const data = {
            title: req.body.title,
            categories: req.body.categories,
            processType: req.body.processType,
            measurementCategory: req.body.measurementCategory,
            image: req.body.image
        }

        let persistedIngredient = await Ingredient.findOne({
            title: req.body.title
        });

        if (persistedIngredient !== null) {
            req.session.error = 'Ya existe un ingrediente con el nombre indicado.';
            res.redirect('back');
        } else {
            let ingredient = new Ingredient(data);
            await ingredient.save();
            req.session.success = 'Ingrediente creado satisfactoriamente!';
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
            .populate('processTypes', { strictPopulate: false })
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
        if (req.file) {
            if (ingredient.image.public_id) await cloudinary.v2.uploader.destroy(ingredient.image.public_id);
            const { secure_url, public_id } = req.file;
            ingredient.image = { secure_url, public_id };
        }
        await ingredient.save();

        req.session.success = 'Ingrediente actualizado satisfactoriamente!';
        res.redirect('/ingredients');
    },

    async ingredientDestroy(req, res, next) {
        const ingredient = await Ingredient.findById(req.params.id);
        if (ingredient.image.public_id) await cloudinary.v2.uploader.destroy(ingredient.image.public_id);
        await Ingredient.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Ingrediente eliminado satisfactoriamente!';
        res.redirect('/ingredients');
    }
}