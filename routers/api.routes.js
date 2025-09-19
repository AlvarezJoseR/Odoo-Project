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
const createProductSchema = require('./../schemas/Product/create.product.schema.js');
const createBankAccountSchema = require('./../schemas/BankAccount/create.bankAccount.schema.js');
const createInvoiceSchema = require('./../schemas/Invoices/create.invoices.schema.js');
const updateProductSchema = require('./../schemas/Product/update.product.schema.js');

//Auth Routes
router.post('/login', validator(loginSchema), mainController.login);

//Customer Routes
router.post('/customer', sessionValidator, validator(createCustomerSchema),  mainController.createCustomer);
router.put('/customer/:id', sessionValidator, companyValidator, mainController.updateCustomer)
router.delete('/customer/:id', sessionValidator, mainController.deleteCustomer)
router.get('/customer/:id', sessionValidator, mainController.getCustomerById)
router.get('/customer', sessionValidator, mainController.getCustomerByFilters)

//Products Routes
router.post('/product', sessionValidator, validator(createProductSchema), mainController.createProduct);
router.delete('/product/:id', sessionValidator, mainController.deleteProduct);
router.get('/product/:id', sessionValidator, mainController.getProductById)
router.put('/product/:id', sessionValidator, validator(updateProductSchema), mainController.updateProduct);

//Bank account Routes
router.post('/bankaccount', sessionValidator, validator(createBankAccountSchema), mainController.createBankAccount)
router.delete('/bankaccount/:id', sessionValidator, mainController.deleteBankAccount )

//Invoice Routes
router.post('/invoice', sessionValidator, validator(createInvoiceSchema), mainController.createInvoice)

//Models Routes
router.get('/models', sessionValidator, mainController.getModels);


module.exports = router;