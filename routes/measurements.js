const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    asyncErrorHandler
} = require('../middleware');
const {
    categoryIndex,
    categoryNew,
    categoryCreate,
    categoryShow,
    categoryEdit,
    categoryUpdate,
    categoryDestroy
} = require('../controllers/categories');

router.get('/', asyncErrorHandler(categoryIndex));

router.get('/new', categoryNew);

router.post('/', asyncErrorHandler(categoryCreate));

router.get('/:id', asyncErrorHandler(categoryShow));

router.get('/:id/edit', asyncErrorHandler(categoryEdit));

router.put('/:id', asyncErrorHandler(categoryUpdate));

router.delete('/:id', asyncErrorHandler(categoryDestroy));

module.exports = router;