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
    recipeShow
} = require('../controllers/recipes');

router.get('/',
    asyncErrorHandler(searchAndFilterRecipes),
    asyncErrorHandler(recipeIndex)
);

router.get('/new',
    asyncErrorHandler(recipeNew)
);

router.post('/', asyncErrorHandler(recipeCreate));

router.get('/:id', asyncErrorHandler(recipeShow));

module.exports = router;