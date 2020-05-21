const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middleware');
const { landingPage } = require('../controllers')

/* GET home page. */
router.get('/', landingPage);

module.exports = router;
