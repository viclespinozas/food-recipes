const express = require('express');
const router = express.Router({ mergeParams: true });
const {
    asyncErrorHandler
} = require('../middleware');
const {
    measurementIndex,
    measurementNew,
    measurementCreate,
    measurementShow,
    measurementEdit,
    measurementUpdate,
    measurementDestroy
} = require('../controllers/measurements');

router.get('/', asyncErrorHandler(measurementIndex));

router.get('/new', measurementNew);

router.post('/', asyncErrorHandler(measurementCreate));

router.get('/:id', asyncErrorHandler(measurementShow));

router.get('/:id/edit', asyncErrorHandler(measurementEdit));

router.put('/:id', asyncErrorHandler(measurementUpdate));

router.delete('/:id', asyncErrorHandler(measurementDestroy));

module.exports = router;