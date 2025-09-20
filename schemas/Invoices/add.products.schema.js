const Joi = require('joi');
const addProductSchema = Joi.object({

    products: Joi.array().items(Joi.object({

        price_unit: Joi.number().integer().optional(),
        quantity: Joi.number().integer().optional(),
        product_id: Joi.number().integer().required()
    })).required()
});

module.exports = addProductSchema;

