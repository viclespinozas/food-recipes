const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    asyncErrorHandler
} = require('../middleware');
const {
    measurementCategoryIndex,
    measurementCategoryNew,
    measurementCategoryCreate,
    measurementCategoryShow,
    measurementCategoryEdit,
    measurementCategoryUpdate,
    measurementCategoryDestroy
} = require('../controllers/measurements-categories');

router.get('/', asyncErrorHandler(measurementCategoryIndex));

router.get('/new', measurementCategoryNew);

router.post('/', asyncErrorHandler(measurementCategoryCreate));

router.get('/:id', asyncErrorHandler(measurementCategoryShow));

router.get('/:id/edit', asyncErrorHandler(measurementCategoryEdit));

router.put('/:id', asyncErrorHandler(measurementCategoryUpdate));

router.delete('/:id', asyncErrorHandler(measurementCategoryDestroy));

module.exports = router;