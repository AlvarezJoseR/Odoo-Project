const express = require('express');
const router = express.Router();

//Middlewares
const sessionValidator = require('../middleware/checkSession.middleware.js');
const validator = require('../middleware/validate.middleware.js');
const companyValidator = require('../middleware/validateCompany.middleware.js');

//Schemas
const createCustomerSchema  = require('../schemas/Customer/create.customer.schema.js');

//Controllers
const customerController = require('../controllers/customer.controller.js');

router.post('/', sessionValidator, validator(createCustomerSchema), customerController.createCustomer);
router.put('/:id', sessionValidator, companyValidator, customerController.updateCustomer);
router.delete('/:id', sessionValidator, customerController.deleteCustomer)
router.get('/:id', sessionValidator, customerController.getCustomerById)
router.get('/', sessionValidator, customerController.getCustomerByFilters)

module.exports = router;