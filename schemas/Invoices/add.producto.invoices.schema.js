const Joi = require('joi')
const addProductInvoiceSchema = Joi.object({
    products: Joi.array().items(Joi.object({
        move_id: Joi.number().integer(),
        product_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().optional(),
        price_unit: Joi.number().integer().optional()
    }))
}
);

module.exports = addProductInvoiceSchema;