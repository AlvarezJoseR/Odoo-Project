const Joi = require('joi');

const filterCustomerSchema = Joi.object({
    id: Joi.number().integer().positive(),
    name: Joi.string().trim(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().trim(),
    mobile: Joi.string().trim(),
    is_company: Joi.boolean(),
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    vat: Joi.string().trim(), 
});

module.exports = filterCustomerSchema;