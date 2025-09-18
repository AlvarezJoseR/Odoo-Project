const Joi = require('joi');

const createBankAccountSchema = Joi.object({
  bank_id: Joi.number().positive().required(), 
  partner_id: Joi.number().positive().required(),
  acc_number: Joi.number().positive().required(),  
});

module.exports = createBankAccountSchema;
