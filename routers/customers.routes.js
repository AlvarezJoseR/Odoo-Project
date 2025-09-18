const express = require('express')
const router = express.Router();
const validator = require('express-joi-validation').createValidator({})
const sessionValidator = require('../middleware/checkSession.middleware.js');
const companyValidator = require('../middleware/validateCompany.middleware.js');
const customerController = require('../controllers/customer.controller.js')
const createCustomerSchema = require('../schemas/Customer/create.customer.schema.js');
const updateCustomerSchema = require('../schemas/Customer/update.customer.schema.js');
const filterCustomerSchema = require('../schemas/Customer/filter.customer.schema.js');

//Customer routes
router.get('/', sessionValidator, validator.query(filterCustomerSchema), customerController.getAllCustomer);
router.get('/fields', sessionValidator, customerController.getCustomerFields);
router.post('/', sessionValidator, validator.body(createCustomerSchema), companyValidator, customerController.createCustomer);
router.delete('/:id', sessionValidator, customerController.deleteCustomer);
router.patch('/:id', sessionValidator, validator.body(updateCustomerSchema), companyValidator, customerController.updateCustomer);

module.exports = router;