const Joi = require('joi')
const bankAccountSchema = require('./../BankAccount/create.bankAccount.schema');

const createCustomerSchema = Joi.object({
  is_company: Joi.boolean().required(),
  company_id: Joi.number().integer().required(),

  name: Joi.string().required(),

  street: Joi.string().optional().allow(''),
  street2: Joi.string().optional().allow(''),
  city: Joi.string().optional().allow(''),
  state_id: Joi.number().integer().optional(),
  country_id: Joi.number().integer().optional(),
  zip: Joi.string().optional().allow(''),
  customer_rank: Joi.number().integer().optional(),
  supplier_rank: Joi.number().integer().optional(),
  vat: Joi.string().optional().allow(''),

  phone: Joi.string().optional().allow(''),
  mobile: Joi.string().optional().allow(''),

  email: Joi.string().email().optional().allow(''),
  website: Joi.string().uri().optional().allow(''),

  lang: Joi.string().optional(),
  bank_account: Joi.array().items(bankAccountSchema).optional()
});

module.exports = createCustomerSchema;