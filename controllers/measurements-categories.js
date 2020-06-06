const Measurement = require('../models/measurement');
const MeasurementCategory = require('../models/measurement-category');

module.exports = {
    async measurementCategoryIndex(req, res, next) {
        let measurements = await MeasurementCategory.find({});

        if (!measurements) {
            res.local.error = "No measurements created yet!";
        }

        res.render('measurements/index', {
            measurements
        });
    },

    measurementCategoryNew(req, res, next) {
        res.render('measurements/new');
    },

    async measurementCategoryCreate(req, res, next) {
        const data = {
            title: req.body.title
        }

        let persistedMeasurement = await Measurement.findOne({
            title: req.body.title
        });

        if (persistedMeasurement !== null) {
            req.session.error = 'There is an existent measurement with that name!.';
            res.redirect('back');
        } else {
            let measurement = new Measurement(data);
            await measurement.save();
            req.session.success = 'Measurement created successfully!';
            res.redirect('/measurements');
        }
    },

    async measurementCategoryShow(req, res, next) {
        let measurement = await Measurement.findById(req.params.id);
        res.render('measurements/show', { measurement });
    },

    async measurementCategoryEdit(req, res, next) {
        let measurement = await Measurement.findById(req.params.id);
        res.render('measurements/edit', { measurement });
    },

    async measurementCategoryUpdate(req, res, next) {
        const measurement = await Measurement.findById(req.params.id);
        measurement.title = req.body.title;
        await measurement.save();

        req.session.success = 'Measurement updated successfully!';
        res.redirect('/measurements');
    },

    async measurementCategoryDestroy(req, res, next) {
        await Measurement.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Measurement deleted successfully!';
        res.redirect('/measurements');
    }
}