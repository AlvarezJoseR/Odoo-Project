const productService = require('../services/product.service.js');


//Products
exports.createProduct = async (req, res) => {
    try {
        const credentials = req.session.user;
        const product_data = req.body;
        const response = await productService.createProduct(credentials, product_data);
        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.getProductById = async (req, res) => {
    try {
        const product_id = req.params.id;
        const credentials = req.session.user;
        const response = await productService.getProductById(credentials, product_id);
        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.deleteProduct = async (req, res) => {
    try {
        const product_id = req.params.id;
        const credentials = req.session.user;
        const response = await productService.deleteProduct(credentials, product_id);
        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.updateProduct = async (req, res) => {
    try {
        const credential = req.session.user;
        const product_id = req.params.id;
        const product_data = req.body;

        const response = await productService.updateProduct(credential, product_id, product_data);
        res.status(response.statusCode).json(response.data );
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.getProductsByFilters = async (req, res) => {
    try {
        const credentials = req.session.user;
        const filters = req.query
        const response = await productService.getProductsByFilters(credentials, filters);

        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};