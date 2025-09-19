const Joi = require('joi')

const createCustomerSchema = Joi.object({

    name: Joi.string().required(),
    list_price: Joi.number().positive().required(),
    sale_ok: Joi.boolean().optional(),
    purchase_ok: Joi.boolean().optional(),
    standard_price: Joi.number().positive(),

});

module.exports = createCustomerSchema;