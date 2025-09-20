const Joi = require('joi')

const deleteProductsInvoiceSchema = Joi.object({
    products: Joi.array().items(Joi.number().integer().positive()),
});

module.exports = deleteProductsInvoiceSchema;