const Joi = require('joi')

const createProductSchema = Joi.object({
    name: Joi.string().optional(),
    list_price: Joi.number().positive().required(),
    sale_ok: Joi.boolean().optional(),
    purchase_ok: Joi.boolean().optional(),
    standard_price: Joi.number().positive(),

});

module.exports = createProductSchema;