const Measurement = require('../models/measurement');
const MeasurementCategory = require('../models/measurement-category');

module.exports = {
    async measurementIndex(req, res, next) {
        let measurements = await Measurement.find({});

        if (!measurements) {
            res.local.error = "No measurements created yet!";
        }

        res.render('measurements/index', {
            measurements
        });
    },

    measurementNew(req, res, next) {
        res.render('measurements/new');
    },

    async measurementCreate(req, res, next) {
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

    async measurementShow(req, res, next) {
        let measurement = await Measurement.findById(req.params.id);
        res.render('measurements/show', { measurement });
    },

    async measurementEdit(req, res, next) {
        let measurement = await Measurement.findById(req.params.id);
        res.render('measurements/edit', { measurement });
    },

    async measurementUpdate(req, res, next) {
        const measurement = await Measurement.findById(req.params.id);
        measurement.title = req.body.title;
        await measurement.save();

        req.session.success = 'Measurement updated successfully!';
        res.redirect('/measurements');
    },

    async measurementDestroy(req, res, next) {
        await Measurement.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Measurement deleted successfully!';
        res.redirect('/measurements');
    }
}