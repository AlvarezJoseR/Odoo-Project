const express = require('express')
const router = express.Router();
const sessionValidator = require('../middleware/checkSession.middleware.js');
const companyController = require('../controllers/company.controller.js')

//Company routes
router.get('/', sessionValidator, companyController.getAllCompanies);
router.get('/fields', sessionValidator, companyController.getCompanyfields);

module.exports = router;