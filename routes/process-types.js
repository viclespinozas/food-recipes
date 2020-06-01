const express = require('express');
const router = express.Router();
const {
    asyncErrorHandler
} = require('../middleware');
const {
    processTypeIndex,
    processTypeNew,
    processTypeCreate,
    processTypeShow,
    processTypeEdit,
    processTypeUpdate,
    processTypeDestroy
} = require('../controllers/process-types');

router.get('/', asyncErrorHandler(processTypeIndex));

router.get('/new', processTypeNew);

router.post('/', asyncErrorHandler(processTypeCreate));

router.get('/:id', asyncErrorHandler(processTypeShow));

router.get('/:id/edit', asyncErrorHandler(processTypeEdit));

router.put('/:id', asyncErrorHandler(processTypeUpdate));

router.delete('/:id', asyncErrorHandler(processTypeDestroy));

module.exports = router;