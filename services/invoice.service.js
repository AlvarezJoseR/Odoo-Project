const productService = require('./product.service');
const odooQuery = require('../helper/odoo.query');

exports.createInvoice = async (credentials, data) => {
    try {
        const invoice_data = {};
        const { db, uid, password } = credentials;
        data.invoice_date = new Date();
        //Prepare invoice data
        for (const [key, value] of Object.entries(data)) {
            if (key != 'products') {
                invoice_data[key] = value;
            }
        }

        //Create invoice
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "create", "account.move", [invoice_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error creando la factura.", data: [] };

        //add products
        if (data.hasOwnProperty('products')) {
            for (const product of data.products) {
                if (!product.invoice_id) product.move_id = response.data;
                await invoiceService.addProduct(credentials, product);
            }
        }

        //Return new invoice data
        const invoice = await this.getInvoiceById(credentials, response.data);
        return { statusCode: 200, message: "Factura creada.", data: invoice.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] };
    }
}

exports.getInvoiceById = async (credentials, invoice_id) => {
    try {
        const { db, uid, password } = credentials;

        //Verify valid id
        const id = Number(invoice_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: 'ID inválido', data: [] }
        }

        //Verify invoice exists
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "search_read", "account.move", [[['id', '=', id]]], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo la factura.", data: [] }
        if (response.data.length === 0) return { statusCode: 404, message: `La factura con id '${invoice_id}' no existe`, data: [] };

        //Return invoice data
        return { statusCode: 200, message: "Factura obtenida.", data: response.data[0] };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500, message: "Error interno.", data: []
        }
    }
}

exports.addProductInvoice = async (credentials, product_invoice_data) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(product_invoice_data.move_id);
        const product_id = product_invoice_data.product_id;

        if (isNaN(id)) {
            return { statusCode: 400, message: 'ID inválido', data: [] }
        }

        product_invoice_data.move_id = id;

        //Product exist
        const product = await productService.getProductById(credentials, product_id);
        if (!product || product.length === 0) return { statusCode: 404, message: `El producto con id '${product_id}' no existe`, data: [] };

        //Add product
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "create", "account.move.line", [product_invoice_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error agregando el producto a la factura.", data: [] }

        return { statusCode: 200, message: "Producto agregado a la factura.", data: response.data };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, message: "Error interno.", data: [] };
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
        const { db, uid, password } = credentials;
        const id = Number(invoice_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: 'ID inválido', data: [] }
        }

        //Verify invoice exists
        const invoice = await this.getInvoiceById(credentials, invoice_id);
        if (!invoice || invoice.data.length === 0) return { statusCode: 404, message: `La factura con id '${invoice_id}' no existe`, data: [] };

        invoice_id = id;
        //Confirm invoice
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "action_post", "account.move", [[invoice_id]], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error confirmando la factura.", data: [] }

        return { statusCode: 200, message: "Factura confirmada.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: []};
    }
}
