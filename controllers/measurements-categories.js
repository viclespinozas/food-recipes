const Measurement = require('../models/measurement');
const MeasurementCategory = require('../models/measurement-category');

module.exports = {
    async measurementCategoryIndex(req, res, next) {
        let measurementCategories = await MeasurementCategory.find({});

        if (!measurementCategories) {
            res.local.error = "No measurements created yet!";
        }

        res.render('measurements/category_index', {
            measurementCategories
        });
    },

    measurementCategoryNew(req, res, next) {
        res.render('measurements/category_new');
    },

    async measurementCategoryCreate(req, res, next) {
        let persistedMeasurementCategory = await MeasurementCategory.findOne({
            ingredient: req.body.ingredient
        });

        if (persistedMeasurementCategory !== null) {
            req.session.error = 'There is an existent measurement category with that name!.';
            res.redirect('back');
        } else {
            let measurementCategory = new MeasurementCategory(req.body);
            await measurementCategory.save();
            req.session.success = 'Measurement Category created successfully!';
            res.redirect('/measurements-categories');
        }
    },

    async measurementCategoryShow(req, res, next) {
        let measurementCategory = await MeasurementCategory.findById(req.params.id);
        res.render('measurements/category_show', { measurementCategory });
    },

    async measurementCategoryEdit(req, res, next) {
        let measurementCategory = await MeasurementCategory.findById(req.params.id);
        res.render('measurements/category_edit', { measurementCategory });
    },

    async measurementCategoryUpdate(req, res, next) {
        const measurementCategory = await MeasurementCategory.findById(req.params.id);
        measurementCategory.ingredient = req.body.ingredient;
        measurementCategory.weight = req.body.weight;
        await measurementCategory.save();

        req.session.success = 'Measurement Category updated successfully!';
        res.redirect('/measurements-categories');
    },

    async measurementCategoryDestroy(req, res, next) {
        await MeasurementCategory.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Measurement Category deleted successfully!';
        res.redirect('/measurements-categories');
    }
}