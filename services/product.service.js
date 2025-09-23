const odooQuery = require('../helper/odoo.query');

exports.createProduct = async (credentials, data) => {
    try {
        const { db, uid, password } = credentials;
        //Create product
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "product.template","create", [data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error creando el producto.", data: [response.data.data.message] };
        //Return info of new product
        const new_product = await this.getProductById(credentials, response.data);
        return { statusCode: 200, message: "Producto creado.", data: new_product.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}

exports.deleteProduct = async (credentials, product_id) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(product_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: 'ID inválido', data: [] }
        }

        //Verify product exists
        const product = await this.getProductById(credentials, product_id);
        if (!product || product.data.length === 0) return { statusCode: 404, message: `El producto con id '${product_id}' no existe`, data: [] };

        //Delete product
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "product.template", "write", [[id], { active: false }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] }
        if (response.success === false) return { statusCode: 400, message: "Error eliminando el producto.", data: [response.data.data.message] }

        return { statusCode: 200, message: "Producto eliminado.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}

exports.getProductsByFilters = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "product.template", "search_read",[filters]]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los productos.", data: [response.data.data.message] };
        return { statusCode: 200, message: "Productos obtenidos.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}

exports.updateProduct = async (credentials, product_id, product_data = {}) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(product_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify product exists
        const product = await this.getProductById(credentials, product_id);
        if (!product || product.data.length === 0) return { statusCode: 404, message: `El producto con id '${product_id}' no existe`, data: [] };

        //Update product
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "product.template",  "write",[[id], product_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error actualizando el producto.", data: [response.data.data.message] };
        //Return updated product info
        const updated_product = await this.getProductById(credentials, product_id);
        return { statusCode: 200, message: "Producto actualizado.", data: updated_product.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}

exports.getProductById = async (credentials, product_id) => {
    try {
        const id = Number(product_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify product exists
        const response = await this.getProductsByFilters(credentials, [['id', '=', id]]);
        if (!response || response.data.length === 0) return { statusCode: 404, message: `El producto con id '${product_id}' no existe`, data: [] }

        return { statusCode: 200, message: "Producto obtenido.", data: response.data[0] };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}