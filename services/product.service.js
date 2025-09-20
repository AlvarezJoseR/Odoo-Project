const odooQuery = require('../helper/odoo.query');

exports.createProduct = async (credentials, data) => {
    try {
        const response = odooQuery.query(credentials, "create", "product.template", [data], {});
        return response;
    } catch (error) {
        throw error
    }
}

exports.deleteProduct = async (credentials, product_id) => {
    try {
        //Verify valid id
        const id = parseInt(product_id);

        if (isNaN(id)) {
            throw new Error('invalid ID')
        }

        //Verify product exists
        const product = await this.getProducts(credentials, [['id', "=", id]]);
        if (!product || product.length === 0) {
            throw new Error('product does not exist')
        }

        const response = await odooQuery.query(credentials, "write", "product.template", [[id], { active: false }], {});
        return response;

    } catch (error) {
        throw error
    }
}

exports.getProducts = async (credentials, filters = []) => {
    try {
        const response = odooQuery.query(credentials, "search_read", "product.template", [filters], {});
        return response;

    } catch (error) {

        throw error
    }
}

exports.updateProduct = async (credentials, product_id, product_data = {}) => {
    try {
        //Verify valid id
        const id = parseInt(product_id);

        if (isNaN(id)) {
            throw new Error('invalid ID')
        }

        //Verify customer exists
        const product = await this.getProducts(credentials, [['id', "=", product_id]]);
        if (!product || product.length === 0) throw new Error('product does not exist')

        const response = await odooQuery.query(credentials, "write", "product.template", [[id], product_data], {});
        return response;
    } catch (error) {

        throw error;
    }
}