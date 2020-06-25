const Measurement = require('../models/measurement');
const MeasurementCategory = require('../models/measurement-category');

module.exports = {
    async measurementCategoryIndex(req, res, next) {
        let measurementCategories = await MeasurementCategory.find({});

        if (!measurementCategories) {
            res.local.error = "No hay categorías de medidas creadas todavía!";
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
            req.session.error = 'Ya existe una categoría con el nombre indicado!.';
            res.redirect('back');
        } else {
            let measurementCategory = new MeasurementCategory(req.body);
            await measurementCategory.save();
            req.session.success = 'Categoría creada satisfactoriamente!';
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

        req.session.success = 'Categoría actualizada satisfactoriamente!';
        res.redirect('/measurements-categories');
    },

    async measurementCategoryDestroy(req, res, next) {
        await MeasurementCategory.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Categoría eliminada satisfactoriamente!';
        res.redirect('/measurements-categories');
    }
}