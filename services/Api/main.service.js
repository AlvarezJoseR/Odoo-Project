//imports
const axios = require('axios');
const URL = process.env.URL;

//Service
const productService = require('../product.service');
const customerService = require('../customers.service');
const bankAccountService = require('../bankAccount.service');
const bankService = require('../bank.service');
const invoiceService = require('../invoice.service');

//Schemas
const createCustomerSchema = require('../../schemas/Customer/create.customer.schema');



exports.createCustomer = async (credentials, customer_info) => {
    //Create customer
    try {
        const customer_fields = createCustomerSchema.describe().keys;
        const customer_data = {};

        //Prepare customer data
        for (const [key, value] of Object.entries(customer_info)) {
            if (customer_fields.hasOwnProperty(key) && key != 'bank_account') {
                customer_data[key] = value;
            }
        }

        //create customer
        const customer_id = await customerService.createCustomer(credentials, customer_data);
        if (customer_id.hasOwnProperty('error'))
            throw new Error('customer creation error ' + response.error.data.message);

        //Create bank account
        if (customer_info.hasOwnProperty('bank_account')) {
            for (const bank_account of customer_info.bank_account) {
                bank_account.partner_id = customer_id;
                await this.createBankAccount(credentials, bank_account);
            }
        }

        //Return new customer data
        const new_customer = await customerService.getAllCustomer(credentials, [['id', "=", customer_id]]);
        return (new_customer);

    } catch (e) {
        throw e;
    }
}

exports.getCutomerById = async (credentials, customer_id) => {
    try {
        const response = await customerService.getAllCustomer(credentials, [['id', '=', customer_id]]);
        return response;
    } catch (e) {
        throw e;
    }
}

exports.getCutomerByFilters = async (credentials, filters) => {
    try {
        fetch_filters = [];
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined) {
                    fetch_filters.push([key, 'ilike', value]);
                }
            }
        }
        const response = await customerService.getAllCustomer(credentials, fetch_filters);
        return (response);

    } catch (e) {
        throw e;
    }
}

exports.deleteCustomer = async (credentials, customer_id) => {
    try {
        const response = await customerService.deleteCustomer(credentials, customer_id);
        return (response);

    } catch (e) {
        throw e;
    }
}

exports.updateCustomer = async (credentials, customer_id, customer_data) => {
    try {
        await customerService.updateCustomer(credentials, customer_id, customer_data);
        const response = await customerService.getAllCustomer(credentials, [['id', '=', customer_id]]);
        return (response);

    } catch (e) {

        throw e;
    }
}


exports.getModels = async (credentials, model) => {
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
                    model,
                    "fields_get",
                    [],
                    { attributes: ["string", "help", "type"] }
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data.result;

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}


// products
exports.createProduct = async (credentials, product_data) => {
    try {
        const product_id = await productService.createProduct(credentials, product_data);
        if (product_id.hasOwnProperty('error'))
            throw new Error('product creation error ' + product.error.data.message);

        const product = await productService.getProducts(credentials, [['id', '=', product_id]])
        return product;

    } catch (error) {
        console.error(error.product?.data || error.message);
        throw error;
    }
}

exports.getProductById = async (credentials, product_id) => {
    try {
        const response = await productService.getProducts(credentials, [['id', '=', product_id]]);
        return response;
    } catch (e) {
        throw e;
    }
}

exports.deleteProduct = async (credentials, product_id) => {
    try {
        const response = await productService.deleteProduct(credentials, product_id);
        return (response);

    } catch (e) {
        throw e;
    }
}

exports.updateProduct = async (credentials, product_id, product_data) => {
    try {
        await productService.updateProduct(credentials, product_id, product_data);
        const response = await productService.getProducts(credentials, [['id', '=', product_id]]);
        return (response);
    } catch (e) {

        throw e;
    }
}

//BankAccount
exports.createBankAccount = async (credentials, bank_account) => {
    try {
        const bank_account_data = { "acc_number": bank_account.acc_number, "partner_id": bank_account.partner_id, "bank_id": 0 };
        //If send bank id
        if (bank_account.hasOwnProperty('bank_id')) {
            bank_account_data.bank_id = bank_account.bank_id
        } else {
            //Find bank by name
            const bank = await bankService.getBank(credentials, [['name', 'ilike', bank_account.bank_name]]);
            if (bank && bank.length === 1) {
                bank_account_data.bank_id = bank[0].id;
            } else {
                //create new bank
                const new_bank_id = await bankService.createBank(credentials, { "name": bank_account.bank_name });

                if (new_bank_id.hasOwnProperty('error'))
                    throw new Error('bank account creation error ' + bank_account_id.error.data.message);

                bank_account_data.bank_id = new_bank_id
            }
        }

        //Create bank account
        const bank_account_id = await bankAccountService.createBankAccount(credentials, bank_account_data);
        if (bank_account_id.hasOwnProperty('error'))
            throw new Error('bank account creation error ' + bank_account_id.error.data.message);


        const bankAccount = await bankAccountService.getBankAccount(credentials, [['id', '=', bank_account_id]])
        return bankAccount;

    } catch (error) {
        console.error(error.product?.data || error.message);
        throw error;
    }
}

exports.deleteBankAccount = async (credentials, bank_account_id) => {
    try {
        const response = await bankAccountService.deleteBankAcount(credentials, bank_account_id);
        return (response);

    } catch (e) {
        throw e;
    }
}

//Invoices
exports.createInvoice = async (credentials, data) => {
    try {

        const invoice_data = {}
        //Prepare invoice data
        for (const [key, value] of Object.entries(data)) {
            if (data.hasOwnProperty(key) && key != 'products') {
                invoice_data[key] = value;
            }
        }

        const invoice_id = await invoiceService.createInvoice(credentials, invoice_data);
        if (invoice_id.hasOwnProperty('error'))
            throw new Error('invoice creation error ' + invoice_id.error.data.message);

        //add products
        if (data.hasOwnProperty('products')) {
            for (const product of data.products) {
                if (!product.invoice_id) product.move_id = invoice_id;
                await invoiceService.addProduct(credentials, product);
            }
        }

        const invoice = await invoiceService.getInvoice(credentials, [['id', '=', invoice_id]])
        return invoice;
    } catch (error) {
        throw error
    }
}
