const express = require('express')
const router = express.Router();
const sessionValidator = require('../middleware/checkSession.middleware.js');
const companyValidator = require('../middleware/validateCompany.middleware.js');
const customerController = require('../controllers/customer.controller.js')
const createCustomerSchema = require('../schemas/Customer/create.customer.schema.js');
const updateCustomerSchema = require('../schemas/Customer/update.customer.schema.js');
const filterCustomerSchema = require('../schemas/Customer/filter.customer.schema.js');

//Customer routes
router.get('/', sessionValidator, customerController.getAllCustomer);
router.get('/fields', sessionValidator, customerController.getCustomerFields);
router.post('/', sessionValidator, companyValidator, customerController.createCustomer);
router.delete('/:id', sessionValidator, customerController.deleteCustomer);
router.patch('/:id', sessionValidator, companyValidator, customerController.updateCustomer);

module.exports = router;