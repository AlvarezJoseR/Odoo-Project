const Joi = require('joi');

const customerFilterSchema = Joi.object({
    id: Joi.number().integer().positive(),
    name: Joi.string().trim(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().trim(),
    mobile: Joi.string().trim(),
    is_company: Joi.boolean(),
    street: Joi.string().trim(),
    city: Joi.string().trim(),
    state_id: Joi.number().integer().positive(),
    country_id: Joi.number().integer().positive(),
    vat: Joi.string().trim(), 
});

module.exports = customerFilterSchema;