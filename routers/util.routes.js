const express = require('express');
const router = express.Router();
const sessionValidator = require('./../middleware/checkSession.middleware')
//Controller
const utilController = require('../controllers/util.controller');

//Auth Routes
router.get('/getModel', sessionValidator, utilController.getModel);

module.exports = router;