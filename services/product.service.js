const axios = require('axios');
const URL = process.env.URL;

exports.createProduct = async (credentials, data) => {
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
                    "product.template",
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

        const { db, uid, password } = credentials
        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "product.template",
                    "write",
                    [[id], { active: false }],
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

exports.getProducts = async (credentials, filters = []) => {
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
                    "product.template",
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
        const { db, uid, password } = credentials

        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "product.template",
                    "write",
                    [[id], product_data],
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
        
        throw error;
    }
}