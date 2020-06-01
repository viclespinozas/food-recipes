const ProcessType = require('../models/process-type');

module.exports = {
    async processTypeIndex(req, res, next) {
        let processTypes = await ProcessType.find({});

        if (!processTypes) {
            res.locals.error = "You have not created types yet!.";
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
            req.session.error = 'There is an existent process type with the given name.';
            res.redirect('back');
        } else {
            let processType = new ProcessType(data);
            await processType.save();
            req.session.success = 'process type created successfully!';
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

        req.session.success = 'Process Type updated successfully!';
        res.redirect('/processing/types');
    },

    async processTypeDestroy(req, res, next) {
        await ProcessType.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Process Type deleted successfully!';
        res.redirect('/processing/types');
    }
}