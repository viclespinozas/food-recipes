const express = require('express');
const router = express.Router();
const {
    asyncErrorHandler,
    searchAndFilterRecipes
} = require('../middleware');
const {
    recipeIndex,
    recipeNew,
    recipeCreate,
    recipeShow,
    recipeEdit,
    recipeUpdate,
    recipeDestroy
} = require('../controllers/recipes');

router.get('/',
    asyncErrorHandler(searchAndFilterRecipes),
    asyncErrorHandler(recipeIndex)
);

router.get('/new', asyncErrorHandler(recipeNew));

router.post('/', asyncErrorHandler(recipeCreate));

router.get('/:id', asyncErrorHandler(recipeShow));

router.get('/:id/edit', asyncErrorHandler(recipeEdit));

router.put('/:id', asyncErrorHandler(recipeUpdate));

router.delete('/:id', asyncErrorHandler(recipeDestroy));

module.exports = router;