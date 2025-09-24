const invoiceService = require("../services/invoice.service");
const attachmentService = require("../services/attachment.service");
//Invoices
exports.createInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_data = req.body;
        const response = await invoiceService.createInvoice(credentials, invoice_data);

        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.addProductInvoice = async (req, res) => {

    try {
        let errors = []
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const products = req.body.products;
        for (const p of products) {
            await invoiceService.addProductInvoice(credentials, invoice_id, p);
        }
        const invoice = await invoiceService.getInvoiceById(credentials, invoice_id);
        res.status(invoice.statusCode).json(invoice);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.deleteProductsInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const product_delete_id = req.body.products;
        for (const product of product_delete_id) {
            await invoiceService.deleteProductInvoice(credentials, invoice_id, product);
        }

        //Get updated invoice
        const invoice = await invoiceService.getInvoiceById(credentials, invoice_id);
        res.status(invoice.statusCode).json(invoice);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.getInvoiceById = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const invoice = await invoiceService.getInvoiceById(credentials, invoice_id);

        res.status(invoice.statusCode).json(invoice);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.confirmInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const invoice = await invoiceService.confirmInvoice(credentials, invoice_id);

        res.status(invoice.statusCode).json(invoice);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.addAttachment = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const file = req.file;
        const response = await attachmentService.createAttachment(credentials, "account.move", invoice_id, file);

        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
};

exports.deleteAttachment = async (req, res) => {
    try {
        const credentials = req.session.user;
        const attachment_id = req.params.id;
        const response = await attachmentService.deleteAttachment(credentials, attachment_id);

        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
};