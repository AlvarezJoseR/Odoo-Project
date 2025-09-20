const axios = require('axios');
const URL = process.env.URL;
const productService = require('./product.service');

exports.createInvoice = async (credentials, data) => {

    try {
        const { db, uid, password } = credentials
        data.invoice_date = new Date();
        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "account.move",
                    "create",
                    [data],
                    {}
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.hasOwnProperty('error'))
            return response.data;

        return response.data.result;

    } catch (error) {
        throw error
    }
}

exports.getInvoice = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials
        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "account.move",
                    "search_read",
                    [filters],
                    {}
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.hasOwnProperty('error'))
            return response.data;

        return response.data.result;

    } catch (error) {

        throw error
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
        const { db, uid, password } = credentials
        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "account.move.line",
                    "create",
                    [product_invoice_data],
                    {}
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.hasOwnProperty('error'))
            return response.data;

        return response.data.result;

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

        const { db, uid, password } = credentials
        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "account.move",
                    "write",
                    [[invoiceId], {
                        "invoice_line_ids": [[2, product_invoice_id]]
                    }]
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.data.hasOwnProperty('error'))
            return response.data;

        return response.data.result;

    } catch (error) {
        throw error
    }
}
