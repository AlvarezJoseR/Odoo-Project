const customerService = require('../services/customers.service.js');
const logsRepository = require('../db/Logs/logs.repositoy.js');
exports.createCustomer = async (req, res) => {
    try {
        const customer_data = req.body;
        const credentials = req.session.user;

        //Create customer
        const response = await customerService.createCustomer(credentials, customer_data);
        logsRepository.createLogs([req.originalUrl, response.statusCode, JSON.stringify(response), req.method]);
        res.status(response.statusCode).json(response);
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

        res.status(response.statusCode).json(response);
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
        res.status(response.statusCode).json(response);
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
        const response = await customerService.getCustomerById(credentials, customer_id);
        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}

exports.getCustomerByFilters = async (req, res) => {
    try {
        const filters = req.query
        fetch_filters = [];
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined) {
                    fetch_filters.push([key, 'ilike', value]);
                }
            }
        }
        const credentials = req.session.user;
        const response = await customerService.getCustomerByFilters(credentials, fetch_filters)
        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
}