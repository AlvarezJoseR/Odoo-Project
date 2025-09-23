const odooQuery = require('../helper/odoo.query');

exports.createProduct = async (credentials, data) => {
    try {
        const { db, uid, password } = credentials;
        //Create product
        const response = odooQuery.query("object", "execute_kw", [db, uid, password, "create", "product.template", [data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error creando el producto.", data: [] };

        //Return info of new product
        const new_product = await this.deleteProductById(credentials, response.data);
        return { statusCode: 200, message: "Producto creado.", data: new_product.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

exports.deleteProduct = async (credentials, product_id) => {
    try {
        //Verify valid id
        const id = Number(product_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: 'ID inválido', data: [] }
        }

        //Verify product exists
        await this.getProductById(credentials, product_id);

        //Delete product
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "write", "product.template", [[id], { active: false }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error eliminando el producto.", data: [] }

        return { statusCode: 200, message: "Producto eliminado.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

exports.getProductsByFilters = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials;
        const response = odooQuery.query("object", "execute_kw", [db, uid, password, "search_read", "product.template", [filters]]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los productos.", data: [] };
        return { statusCode: 200, message: "Productos obtenidos.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
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
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "write", "product.template", [[id], product_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error actualizando el producto.", data: [] };
        //Return updated product info
        const updated_product = await this.getProductById(credentials, product_id);
        return { statusCode: 200, message: "Producto actualizado.", data: updated_product.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

exports.getProductById = async (credentials, product_id) => {
    try {
        const id = Number(product_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify product exists
        const response = await this.getProductsByFilters(credentials, [['id', '=', product_id]]);
        if (!response || response.data.length === 0) return { statusCode: 404, message: `El producto con id '${product_id}' no existe`, data: [] }

        return { statusCode: 200, message: "Producto obtenido.", data: response.data[0] };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}