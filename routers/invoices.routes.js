const express = require('express');
const router = express.Router();

//Middleware
const validator = require('../middleware/validate.middleware');
const sessionValidator = require('../middleware/checkSession.middleware.js');

//Schemas
const createInvoiceSchema = require('./../schemas/Invoice/create.invoice.schema.js');
const addProductSchema = require('./../schemas/Invoice/add.product.schema.js');
const deleteProductsInvoiceSchema = require('./../schemas/Invoice/delete.products.invoice.schema.js');

//Controller
const invoiceController = require('../controllers/invoice.controller.js');


//Invoice Routes
router.post('/', sessionValidator, validator(createInvoiceSchema), invoiceController.createInvoice)
router.put('/addproduct/:id', sessionValidator, validator(addProductSchema), invoiceController.addProductInvoice)
router.delete('/deleteproduct/:id', sessionValidator,validator(deleteProductsInvoiceSchema), invoiceController.deleteProductsInvoice)
router.get('/:id', sessionValidator, invoiceController.getInvoiceById);
router.post('/confirm/:id', sessionValidator, invoiceController.confirmInvoice);