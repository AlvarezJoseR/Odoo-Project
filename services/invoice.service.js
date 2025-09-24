const productService = require('./product.service');
const odooQuery = require('../helper/odoo.query');

/**
 * Crea una nueva factura en Odoo y, si corresponde, agrega productos asociados.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Object} data - Datos de la factura a crear (puede incluir products como array).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (factura creada o mensaje de error).
 */
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
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "account.move", "create", [invoice_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error creando la factura.", data: [response.data.data.message] };

        //add products
        if (data.hasOwnProperty('products')) {
            for (const product of data.products) {
                if (!product.invoice_id) product.move_id = response.data;
                await this.addProductInvoice(credentials, product);
            }
        }

        //Return new invoice data
        const invoice = await this.getInvoiceById(credentials, response.data);

        return { statusCode: 200, message: "Factura creada.", data: invoice.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}

/**
 * Obtiene una factura por su ID desde Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} invoice_id - ID de la factura a buscar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (factura encontrada o mensaje de error).
 */
exports.getInvoiceById = async (credentials, invoice_id) => {
    try {
        const { db, uid, password } = credentials;

        //Verify valid id
        const id = Number(invoice_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${invoice_id}' no es un id de una factura valida.`, data: [] }
        }

        //Verify invoice exists
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "account.move","search_read", [[['id', '=', id]]], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo la factura.", data: [response.data.data.message] }
        if (response.data.length === 0) return { statusCode: 404, message: `La factura con id '${invoice_id}' no existe`, data: [] };
        //Return invoice data
        return { statusCode: 200, message: "Factura obtenida.", data: response.data[0] };
    } catch (e) {
        console.error(e);
        return {
            statusCode: 500, message: "Error interno.", data: [e.message]
        }
    }
}

/**
 * Agrega un producto a una factura en Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} invoice_id - ID de la factura.
 * @param {Object} product_invoice_data - Datos del producto a agregar a la factura.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (resultado de la operación o mensaje de error).
 */
exports.addProductInvoice = async (credentials, invoice_id, product_invoice_data) => {
    try {
        const { db, uid, password } = credentials;
        const product_id = product_invoice_data.product_id;
        //Verify valid id
        let id = Number(invoice_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${invoice_id}' no es un id de una factura valida.`, data: [] }
        }
        id = Number(product_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${product_id}' no es un id de producto valido.`, data: [] }
        }

        product_invoice_data.move_id = id;
        //Verify invoice exists

        const invoice = await this.getInvoiceById(credentials, invoice_id);
        if (!invoice || invoice.data.length === 0) return { statusCode: 404, message: `La factura con id '${invoice_id}' no existe`, data: [] };    

        //Product exist
        const product = await productService.getProductById(credentials, product_id);
        console.log(product);
        if(product.statusCode !== 200) return product;
        if (!product || product.data.length === 0) return { statusCode: 404, message: `El producto con id '${product_id}' no existe`, data: [] };

        //Add product
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "account.move.line",  "create", [product_invoice_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] }
        if (response.success === false) return { statusCode: 400, message: "Error agregando el producto a la factura.", data: [response.data.data.message] }
        
        return { statusCode: 200, message: "Producto agregado a la factura.", data: response.data };

    } catch (error) {
        console.error(error);
        return { statusCode: 500, message: "Error interno.", data: [error.message] };
    }
}

/**
 * Elimina un producto de una factura en Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} invoice_id - ID de la factura.
 * @param {number|string} product_invoice_id - ID del producto en la factura a eliminar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (resultado de la operación o mensaje de error).
 */
exports.deleteProductInvoice = async (credentials, invoice_id, product_invoice_id) => {
    try {
        const { db, uid, password } = credentials;
        const id = parseInt(invoice_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${invoice_id}' no es un id valido.`, data: [] }
        }

        const invoice = await this.getInvoiceById(credentials, invoice_id);
        if (!invoice || invoice.data.length === 0) return { statusCode: 404, message: `La factura con id '${invoice_id}' no existe`, data: [] };

        const invoiceId = id;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "account.move", "write", [[invoiceId], {
            "invoice_line_ids": [[2, product_invoice_id]]
        }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error eliminando el producto de la factura.", data: [response.data.data.message] };

        return {statusCode: 200, message: "Producto eliminado de la factura.", data: response.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}

/**
 * Confirma una factura en Odoo por su ID.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} invoice_id - ID de la factura a confirmar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (resultado de la operación o mensaje de error).
 */
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
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "account.move", "action_post", [[invoice_id]], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: response.data.data.message }
        if (response.success === false) return { statusCode: 400, message: "Error confirmando la factura.", data: response.data.data.message }

        return { statusCode: 200, message: "Factura confirmada.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message]};
    }
}
