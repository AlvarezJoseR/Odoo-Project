const express = require('express');
const router = express.Router();

//Controller
const mainController = require('../controllers/main.controller');

//Middleware
const validator = require('../middleware/validate.middleware');
const sessionValidator = require('../middleware/checkSession.middleware');
const companyValidator = require('../middleware/validateCompany.middleware.js');

//Schemas
const createCustomerSchema = require('./../schemas/Customer/create.customer.schema');
const loginSchema = require('./../schemas/Auth/login.schema');

//Auth Routes
router.post('/login', validator(loginSchema), mainController.login);

//Customer Routes
router.post('/customer', sessionValidator, validator(createCustomerSchema),  mainController.createCustomer);
router.put('/customer/:id', sessionValidator, companyValidator, mainController.updateCustomer)
router.get('/customer/:id', sessionValidator, mainController.getCustomerById)
router.get('/customer', sessionValidator, mainController.getCustomerByFilters)
router.delete('/customer/:id', sessionValidator, mainController.getCustomerByFilters)


module.exports = router;