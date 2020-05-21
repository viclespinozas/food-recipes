const express = require('express');
const router = express.Router({ mergeParams: true });
const { asyncErrorHandler } = require('../middleware');
const {
    ingredientIndex,
    ingredientNew,
    ingredientCreate,
    ingredientShow
} = require('../controllers/ingredients');

router.get('/', asyncErrorHandler(ingredientIndex));

router.get('/new', ingredientNew);

router.post('/', asyncErrorHandler(ingredientCreate));

router.get('/:id', asyncErrorHandler(ingredientShow));

module.exports = router;