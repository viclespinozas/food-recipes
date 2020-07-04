const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const {
    asyncErrorHandler,
    searchAndFilterIngredients
} = require('../middleware');
const {
    ingredientIndex,
    ingredientNew,
    ingredientCreate,
    ingredientShow,
    ingredientEdit,
    ingredientUpdate,
    ingredientDestroy
} = require('../controllers/ingredients');

router.get('/',
    asyncErrorHandler(searchAndFilterIngredients),
    asyncErrorHandler(ingredientIndex)
);

router.get('/new', asyncErrorHandler(ingredientNew));

router.post('/', upload.single('image'), asyncErrorHandler(ingredientCreate));

router.get('/:id', asyncErrorHandler(ingredientShow));

router.get('/:id/edit', asyncErrorHandler(ingredientEdit));

router.put('/:id', upload.single('image'), asyncErrorHandler(ingredientUpdate));

router.delete('/:id', asyncErrorHandler(ingredientDestroy));

module.exports = router;