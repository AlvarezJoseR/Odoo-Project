const Joi = require('joi')

const createCustomerSchema = Joi.object({
    id: Joi.number().positive().optional(),
    name: Joi.string().optional(),
    list_price: Joi.number().positive().required(),
    sale_ok: Joi.boolean().optional(),
    purchase_ok: Joi.boolean().optional(),
    standard_price: Joi.number().positive(),

}).xor('name', 'id');

module.exports = createCustomerSchema;