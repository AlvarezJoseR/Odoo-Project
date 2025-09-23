const express = require('express');
const router = express.Router();

//Middleware
const validator = require('../middleware/validate.middleware');
const sessionValidator = require('../middleware/checkSession.middleware.js');

//Schemas
const createProductSchema = require('./../schemas/Product/create.product.schema.js');
const updateProductSchema = require('./../schemas/Product/update.product.schema.js');

//Controller
const productController = require('../controllers/product.controller.js');

//Products Routes
router.post('/', sessionValidator, validator(createProductSchema), productController.createProduct);
router.delete('/:id', sessionValidator, productController.deleteProduct);
router.get('/:id', sessionValidator, productController.getProductById);
router.get('/', sessionValidator, productController.getProductsByFilters);
router.put('/:id', sessionValidator, validator(updateProductSchema), productController.updateProduct);

module.exports = router;