const Category = require('../models/category');

module.exports = {
    async categoryIndex(req, res, next) {
        let categories = await Category.find({});

        if (!categories) {
            res.local.error = "No hay categorías creadas todavía!";
        }

        res.render('categories/index', {
            categories
        });
    },

    categoryNew(req, res, next) {
        res.render('categories/new');
    },

    async categoryCreate(req, res, next) {
        const data = {
            title: req.body.title
        }

        let persistedCategory = await Category.findOne({
            title: req.body.title
        });

        if (persistedCategory !== null) {
            req.session.error = 'Ya existe una categoría con el nombre indicado!.';
            res.redirect('back');
        } else {
            let category = new Category(data);
            await category.save();
            req.session.success = 'Categoría creada satisfactoriamente!';
            res.redirect('/categories');
        }
    },

    async categoryShow(req, res, next) {
        let category = await Category.findById(req.params.id);
        res.render('categories/show', { category });
    },

    async categoryEdit(req, res, next) {
        let category = await Category.findById(req.params.id);
        res.render('categories/edit', { category });
    },

    async categoryUpdate(req, res, next) {
        const category = await Category.findById(req.params.id);
        category.title = req.body.title;
        await category.save();

        req.session.success = 'Categoría actualizada satisfactoriamente!';
        res.redirect('/categories');
    },

    async categoryDestroy(req, res, next) {
        await Category.findByIdAndRemove(req.params.id).exec();
        req.session.success = 'Categoría eliminada satisfactoriamente!';
        res.redirect('/categories');
    }
}