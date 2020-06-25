const Measurement = require('../models/measurement');
const MeasurementCategory = require('../models/measurement-category');

module.exports = {
    async measurementIndex(req, res, next) {
        let measurements = await Measurement.find({});

        if (!measurements) {
            res.local.error = "No hay medidas creadas todavía!";
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
            codeName: req.body.codeName,
            displayName: req.body.displayName
        }

        let persistedMeasurement = await Measurement.findOne({
            codeName: req.body.codeName
        });

        if (persistedMeasurement !== null) {
            req.session.error = 'Ya existe una medida con el nombre indicado!.';
            res.redirect('back');
        } else {
            let measurement = new Measurement(data);
            await measurement.save();
            req.session.success = 'Medida creada satisfactoriamente!';
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
        measurement.codeName = req.body.codeName;
        measurement.displayName = req.body.displayName;
        await measurement.save();

        req.session.success = 'Medida actualizada satisfactoriamente!';
        res.redirect('/measurements');
    },

    async measurementDestroy(req, res, next) {
        await Measurement.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Medida eliminada satisfactoriamente!';
        res.redirect('/measurements');
    }
}