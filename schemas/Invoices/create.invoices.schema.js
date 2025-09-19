const Joi = require('joi')
const addProductInvoiceSchema = require('./../Invoices/add.producto.invoices.schema');
const createInvoicesSchema = Joi.object({

    partner_id: Joi.number().integer().required(),
    invoice_date_due: Joi.date().optional(),
    invoice_payment_term_id: Joi.number().integer(),
    products: Joi.array().items(addProductInvoiceSchema).optional(),
    move_type: Joi.string().required()

}).xor("invoice_date_due", "invoice_payment_term_id");

module.exports = createInvoicesSchema;