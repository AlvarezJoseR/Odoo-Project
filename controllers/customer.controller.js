const customerService = require('../services/customers.service.js');

exports.createCustomer = async (req, res) => {
    try {
        const customer_data = req.body;
        const credentials = req.session.user;

        //Create customer
        const new_customer = await customerService.createCustomer(credentials, customer_data);
        req.status(new_customer.statusCode).json(new_customer.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}

exports.updateCustomer = async (req, res) => {
    try {
        const customer_data = req.body;
        const customer_id = req.params.id;
        const credentials = req.session.user;
        const response = await customerService.updateCustomer(credentials, customer_id, customer_data);

        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}

exports.deleteCustomer = async (req, res) => {
    try {
        const customer_Id = req.params.id;
        const credentials = req.session.user;
        const response = await customerService.deleteCustomer(credentials, customer_Id);
        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}

exports.getCustomerById = async (req, res) => {
    try {
        const customer_id = req.params.id;
        const credentials = req.session.user;
        const response = await customerService.getCustomerById(credentials, [['id', '=', customer_id]]);
        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}

exports.getCustomerByFilters = async (req, res) => {
    try {
        const filters = req.query
        const credentials = req.session.user;
        const response = await customerService.getCustomerByFilters(credentials, filters)
        res.status(response.statusCode).json(response.data);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}