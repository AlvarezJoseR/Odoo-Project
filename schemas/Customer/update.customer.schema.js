const Joi = require('joi')

const updateCustomerSchema = Joi.object({
  is_company: Joi.boolean(),
  company_id: Joi.number().integer().optional(),

  name: Joi.string(),

  street: Joi.string().optional().allow(''),
  street2: Joi.string().optional().allow(''),
  city: Joi.string().optional().allow(''),
  state_id: Joi.number().integer().optional(),
  country_id: Joi.number().integer().optional(),
  zip: Joi.string().optional().allow(''),
  vat: Joi.string().optional().allow(''),
  phone: Joi.string().optional().allow(''),
  mobile: Joi.string().optional().allow(''),
  customer_rank: Joi.number().integer().optional(),
  supplier_rank: Joi.number().integer().optional(),

  email: Joi.string().email().optional().allow(''),
  website: Joi.string().uri().optional().allow(''),

  lang: Joi.string().optional(),
});

module.exports = updateCustomerSchema;