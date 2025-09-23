const express = require('express');
const router = express.Router();

//Middleware
const validator = require('../middleware/validate.middleware');
const sessionValidator = require('../middleware/checkSession.middleware.js');

//Schemas
const createInvoiceSchema = require('./../schemas/Invoices/create.invoices.schema.js');
const addProductSchema = require('./../schemas/Invoices/add.products.schema.js');
const deleteProductsInvoiceSchema = require('./../schemas/Invoices/delete.producto.invoices.schema.js');

//Controller
const invoiceController = require('../controllers/invoice.controller.js');


//Invoice Routes
router.post('/', sessionValidator, validator(createInvoiceSchema), invoiceController.createInvoice)
router.put('/addproduct/:id', sessionValidator, validator(addProductSchema), invoiceController.addProductInvoice)
router.delete('/deleteproduct/:id', sessionValidator,validator(deleteProductsInvoiceSchema), invoiceController.deleteProductsInvoice)
router.get('/:id', sessionValidator, invoiceController.getInvoiceById);
router.post('/confirm/:id', sessionValidator, invoiceController.confirmInvoice);

module.exports = router;