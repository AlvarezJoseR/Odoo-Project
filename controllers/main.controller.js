//Imports
const jwt = require('jsonwebtoken');

//Services
const mainService = require('./../services/Api/main.service');
const authService = require('./../services/auth.service');
const { message } = require('../schemas/BankAccount/create.bankAccount.schema');


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

        res.status(200).json({ status: 200, message: "Successful login", token: token });
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


        res.json({
            status: 200,
            message: "Customer created.",
            data: new_customer
        });
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
        res.status(200).json({ status: 200, message: "Customer updated", data: response });
    } catch (e) {

        res.status(500).json({ error: e.message });
    }

};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer_Id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.deleteCustomer(credentials, customer_Id);
        res.status(200).json({ status: 200, message: "Customer deleted." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.getCustomerById = async (req, res) => {
    try {
        const customer_Id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.getCutomerById(credentials, customer_Id);

        res.status(200).json({ status: 200, data: response });
    } catch (e) {
        res.status(500).json({ error: e });
    }

};

exports.getCustomerByFilters = async (req, res) => {
    try {
        const filters = req.query
        const credentials = req.session.user;
        const response = await mainService.getCutomerByFilters(credentials, filters)
        res.status(200).json({ status: 200, data: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

//Products
exports.createProduct = async (req, res) => {
    try {
        const credentials = req.session.user;
        const product_data = req.body;
        const response = await mainService.createProduct(credentials, product_data);
        res.status(200).json({ stats: 200, message: "Product created.", data: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.getProductById = async (req, res) => {
    try {
        const product_id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.getProductById(credentials, product_id);
        res.status(200).json({ status: 200, data: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.deleteProduct = async (req, res) => {
    try {
        const product_id = req.params.id;
        const credentials = req.session.user;
        const response = await mainService.deleteProduct(credentials, product_id);
        res.status(200).json({ status: 200, message: "Product deleted." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.updateProduct = async (req, res) => {
    try {
        const credential = req.session.user;
        const product_id = req.params.id;
        const product_data = req.body;

        const updated_product = await mainService.updateProduct(credential, product_id, product_data);
        res.status(200).json({ status: 200, message: "Product updated.", data: updated_product });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

//Bank Accounts
exports.createBankAccount = async (req, res) => {
    try {
        const credentials = req.session.user;
        const bank_account_data = req.body;
        const response = await mainService.createBankAccount(credentials, bank_account_data);
        res.status(200).json({ status: 200, message: "Bank account created", data: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.deleteBankAccount = async (req, res) => {
    try {
        const credentials = req.session.user;
        const bank_account_id = req.params.id;
        const response = await mainService.deleteBankAccount(credentials, bank_account_id);
        res.status(200).json({ status: 200, message: "Bank account deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

//Invoices
exports.createInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_data = req.body;
        const response = await mainService.createInvoice(credentials, invoice_data);
        res.status(200).json({ status: 200, message: "Invoice created.", data: response });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.addProductInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const product_data = req.body;
        await mainService.addProductInvoice(credentials, invoice_id, product_data);
        res.status(200).json({ status: 200, message: "Products added." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.deleteProductInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const product_delete_id = req.body.products;
        await mainService.deleteProductInvoice(credentials, invoice_id, product_delete_id);
        res.status(200).json({ status: 200, message: "Products deleted" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.getInvoiceById = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        const invoice = await mainService.getInvoiceById(credentials, invoice_id);

        res.status(200).json({status: 200, data: invoice});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

exports.confirmInvoice = async (req, res) => {
    try {
        const credentials = req.session.user;
        const invoice_id = req.params.id;
        await mainService.confirmInvoice(credentials, invoice_id);

        res.status(200).json({status: 200, message: "Invoice confirmed."});
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

//Models
exports.getModels = async (req, res) => {
    try {
        const credentials = req.session.user;
        const model_name = req.query.name;
        const model = await mainService.getModels(credentials, model_name) || {};
        res.status(200).json({status: 200, data: model });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }

};

