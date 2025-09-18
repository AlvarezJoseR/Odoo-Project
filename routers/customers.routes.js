const express = require('express')
const router = express.Router();
const validator = require('express-joi-validation').createValidator({})
const sessionValidator = require('./../middleware/checkSession.middleware.js');
const customerController = require('./../controllers/customer.controller.js')
const createCustomerSchema = require('../schemas/Customer/create.customer.schema.js');
const updateCustomerSchema = require('../schemas/Customer/update.customer.schema.js');
const filterCustomerSchema = require('../schemas/Customer/filter.customer.schema.js');

//Customer routes
router.get('/', validator.query(filterCustomerSchema), sessionValidator,customerController.getAllCustomer);
router.get('/fields', sessionValidator, customerController.getCustomerFields);
router.post('/', validator.body(createCustomerSchema), sessionValidator, customerController.createCustomer);
router.delete('/:id', sessionValidator, customerController.deleteCustomer);
router.patch('/:id', sessionValidator, validator.body(updateCustomerSchema), customerController.updateCustomer);

module.exports = router;