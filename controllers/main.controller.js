//Imports
const jwt = require('jsonwebtoken');

//Services
const mainService = require('./../services/Api/main.service');
const authService = require('./../services/auth.service')


//Auth 
exports.login = async (req, res) => {
    try {
        const { db, userName, password } = req.body;
        const response = await authService.login(db, userName, password);

        var token = jwt.sign({
            db,
            uid: response,
            password,
        }, 'shhhhh', { expiresIn: '1h' });

        res.status(200).json({ message: "Successful login", token: token });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }

};


// Customer
exports.createCustomer = async (req, res) => {
    try {
        const customer_data = req.body;
        const credentials = req.session.user;

        //Create customer
        const new_customer = await mainService.createCustomer(credentials, customer_data);
        if (new_customer.hasOwnProperty('error'))
            res.status(400).json({ error: 'creation error', message: response.error.data.message });


        res.json(new_customer);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.updateCustomer = async (req, res) => {
    try {
        const customer_data = req.body;
        const customer_Id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.updateCustomer(credentials, customer_Id, customer_data);
        res.status(200).json(response);
    } catch (e) {
        
        res.status(500).json({ error: e.message });
    }

};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer_Id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.deleteCustomer(credentials, customer_Id);
        res.status(200).json(response);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.getCustomerById = async (req, res) => {
    try {
        const customer_Id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.getCutomerById(credentials, customer_Id);

        res.status(200).json({ customer: response });
    } catch (e) {
        res.status(500).json({ error: e });
    }

};

exports.getCustomerByFilters = async (req, res) => {
    try {
        const filters = req.query
        const credentials = req.session.user;
        console.log(1);
        const response = await mainService.getCutomerByFilters(credentials, filters)
        res.status(500).json({ customers: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

//Providers
