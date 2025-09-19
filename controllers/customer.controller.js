const customerService = require('./../services/customers.service');
const mainService = require('./../services/Api/main.service');

exports.getAllCustomer = async (req, res) => {
    filters = [];
    if (req.query) {
        for (const [key, value] of Object.entries(req.query)) {
            if (value !== undefined) {
                filters.push([key, 'ilike', value]);
            }
        }
    }
    const response = await customerService.getAllCustomer(req.session.user, filters);
    res.json(response);
};

exports.getCustomerFields = async (req, res) => {
    try {
        const response = await customerService.getCustomerfields(req.session.user);
        res.json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.createCustomer = async (req, res) => {
    try {
        const customer_data = req.body;

        //Create customer
        const new_customer = await mainService.createCustomer(req.session.user, customer_data);
        if (new_customer.hasOwnProperty('error'))
            res.status(400).json({ error: 'creation error', message: response.error.data.message });


        res.json(new_customer);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.updateCustomer = async (req, res) => {
    //Verify valid id
    const customer_id = parseInt(req.params.id);
    const customer_data = req.body;

    if (isNaN(customer_id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    //Verify customer exists
    const customer = await customerService.getAllCustomer(req.session.user, [['id', "=", customer_id]]);
    if (!customer || customer.length === 0) return res.status(400).json({ error: 'customer does not exist' });

    //Update customer
    const response = await customerService.updateCustomer(req.session.user, customer_id, customer_data);
    if (response.hasOwnProperty('error'))
        res.status(400).json({ error: 'creation error', message: response.error.data.message });

    //Return new customer info
    const updated_customer = await customerService.getAllCustomer(req.session.user, [['id', "=", customer_id]]);
    res.json(updated_customer);
};

exports.deleteCustomer = async (req, res) => {
    //Verify valid id
    const customer_id = parseInt(req.params.id);

    if (isNaN(customer_id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    //Verify customer exists
    const customer = await customerService.getAllCustomer(req.session.user, [['id', "=", customer_id]]);
    if (!customer || customer.length === 0) return res.status(400).json({ error: 'customer does not exist' });

    //Delete customer
    const response = await customerService.deleteCustomer(req.session.user, customer_id);

    res.json(response);
};