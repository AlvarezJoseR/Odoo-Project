const Joi = require('joi')

const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    list_price: Joi.number().positive().optional(),
    sale_ok: Joi.boolean().optional(),
    purchase_ok: Joi.boolean().optional(),
    standard_price: Joi.number().positive().optional(),

});

module.exports = updateProductSchema;