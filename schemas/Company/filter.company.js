const Joi = require('joi');

const filterCompanySchema = Joi.object({
    id: Joi.number().integer().positive(),
    name: Joi.string().trim(),
    email: Joi.string().email({ tlds: { allow: false } }),
    phone: Joi.string().trim(),
});

module.exports = filterCompanySchema;