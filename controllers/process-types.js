const ProcessType = require('../models/process-type');

module.exports = {
    async processTypeIndex(req, res, next) {
        let processTypes = await ProcessType.find({});

        if (!processTypes) {
            res.locals.error = "No hay tipos de procesado creados todavía!.";
        }

        res.render('process-types/index', {
            processTypes
        });
    },

    processTypeNew(req, res, next) {
        res.render('process-types/new');
    },

    async processTypeCreate(req, res, next) {
        const data = {
            title: req.body.title
        }

        let persistedProcessType = await ProcessType.findOne({
            title: req.body.title
        });

        if (persistedProcessType !== null) {
            req.session.error = 'Ya existe un tipo de procesado con el nombre indicado.';
            res.redirect('back');
        } else {
            let processType = new ProcessType(data);
            await processType.save();
            req.session.success = 'Tipo de procesado creado satisfactoriamente!';
            res.redirect('/processing/types');
        }
    },

    async processTypeShow(req, res, next) {
        let processType = await ProcessType.findById(req.params.id);
        res.render('process-types/show', { processType });
    },

    async processTypeEdit(req, res, next) {
        let processType = await ProcessType.findById(req.params.id);
        res.render('process-types/edit', { processType });
    },

    async processTypeUpdate(req, res, next) {
        const processType = await ProcessType.findById(req.params.id);
        processType.title = req.body.title;
        await processType.save();

        req.session.success = 'Tipo de procesado actualizado satisfactoriamente!';
        res.redirect('/processing/types');
    },

    async processTypeDestroy(req, res, next) {
        await ProcessType.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Tipo de procesado eliminado satisfactoriamente!';
        res.redirect('/processing/types');
    }
}