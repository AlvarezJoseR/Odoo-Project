const Joi = require('joi');

const loginSchema = Joi.object({
  userName: Joi.string().email().required(), 
  password: Joi.string().required(),  
  db: Joi.string().required()     
}).min(1);

module.exports = loginSchema;
