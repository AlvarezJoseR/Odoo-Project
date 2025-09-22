const productService = require('./product.service');
const odooQuery = require('../helper/odoo.query');

exports.createInvoice = async (credentials, data) => {

    try {
        data.invoice_date = new Date();
        const response = await odooQuery.query(credentials, "create", "account.move", [data], {});

        return response;
    } catch (e) {
        throw e
    }
}

exports.getInvoice = async (credentials, filters = []) => {
    try {
        const response = await odooQuery.query(credentials, "search_read", "account.move", [filters], {});
        return response;
    } catch (e) {
        throw e
    }
}

exports.addProduct = async (credentials, product_invoice_data) => {
    try {
        //Verify valid id
        
        const id = parseInt(product_invoice_data.move_id);
        const product_id = product_invoice_data.product_id;

        if (isNaN(id)) {
            throw new Error('invalid ID')
        }
        product_invoice_data.move_id = id;

        //Product exist
        const product = await productService.getProducts(credentials, [["id", "=", product_id]]);
        if (!product || product.length === 0) throw new Error(`product '${product_id}' does not exist`)

        //Add product
        const response = await odooQuery.query(credentials, "create", "account.move.line", [product_invoice_data], {});
        return response;

    } catch (error) {
        throw error
    }
}

exports.deleteProductInvoice = async (credentials, invoice_id, product_invoice_id) => {
    try {
        const id = parseInt(invoice_id);
        if (isNaN(id)) {
            throw new Error('invalid ID')
        }

        const invoiceId = id;
        const response = await odooQuery.query(credentials, "write", "account.move", [[invoiceId], {
            "invoice_line_ids": [[2, product_invoice_id]]
        }], {});

        return response;

    } catch (e) {
        throw e
    }
}

exports.confirmInvoice = async (credentials, invoice_id) => {
    try {
        const id = parseInt(invoice_id);
        if (isNaN(id)) {
            throw new Error('invalid ID')
        }

        invoice_id = id;
        const response = await  odooQuery.query(credentials, "action_post", "account.move", [[invoice_id]], {}); 
        return response;

    } catch (e) {
        throw e
    }
}
