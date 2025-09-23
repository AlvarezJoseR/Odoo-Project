//imports
const odooQuery = require('../../helper/odoo.query');

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
        let new_customer_id;
        let errors = [];
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
        new_customer_id = customer_id;


        //Create bank account
        if (customer_info.hasOwnProperty('bank_account')) {
            for (const bank_account of customer_info.bank_account) {
                bank_account.partner_id = new_customer_id;
                try {
                    await this.createBankAccount(credentials, bank_account);
                } catch (e) { errors.push(e.message) }
            }
        }

        //Return new customer data
        const new_customer = await customerService.getAllCustomer(credentials, [['id', "=", new_customer_id]]);
        return ({ customer: new_customer, errors: errors });
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
        const response = this.getCutomerById(credentials, customer_id);
        return (response);
    } catch (e) {
        throw e;
    }
}

//Models
exports.getModels = async (credentials, model) => {
    try {
        const { uid, db, password } = credentials;
        const response = await odooQuery.query("object", 'execute_kw', [db, uid, password, model, 'fields_get', [], { attributes: ["string", "help", "type"] }]);
        //const response = await odooQuery.query(credentials, 'fields_get', model, [], { attributes: ["string", "help", "type"] })
        return response;
    } catch (e) {
        throw e;
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

    } catch (e) {
        throw e;
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

exports.getProducts = async (credentials) => {
    try {
        const response = await productService.getProducts(credentials);
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

    } catch (e) {
        throw e;
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

exports.getBankAccountById = async (credentials, invoice_id) => {
    try {
        const response = await bankAccountService.getBankAccount(credentials, [["id", "=", invoice_id]]);
        return response;
    } catch (e) {
        throw e
    }
}

//Invoices
exports.createInvoice = async (credentials, data) => {
    let new_invoice_id;
    try {
        const invoice_data = {}
        //Prepare invoice data
        for (const [key, value] of Object.entries(data)) {
            if (key != 'products') {
                invoice_data[key] = value;
            }
        }

        const invoice_id = await invoiceService.createInvoice(credentials, invoice_data);
        new_invoice_id = invoice_id;
    } catch (e) {
        throw e
    }

    //add products
    if (data.hasOwnProperty('products')) {
        for (const product of data.products) {
            if (!product.invoice_id) product.move_id = new_invoice_id;
            try {
                await invoiceService.addProduct(credentials, product);
            } catch (e) { }
        }
    }

    const invoice = await invoiceService.getInvoiceById(credentials, new_invoice_id);
    return invoice;

}

exports.addProductInvoice = async (credentials, invoice_id, product_data) => {
    try {
        const response = await invoiceService.addProduct(credentials, { ...product_data, move_id: invoice_id });
        return response;
    } catch (e) {
        throw e
    }
};

exports.deleteProductInvoice = async (credentials, invoice_id, product_delete_id) => {
    try {
        await invoiceService.deleteProductInvoice(credentials, invoice_id, product_delete_id);
        return true;
    } catch (e) {
        throw e
    }
};

exports.getInvoiceById = async (credentials, invoice_id) => {
    try {
        const response = await invoiceService.getInvoiceById(credentials, invoice_id);
        return response;
    } catch (e) {
        throw e
    }
};

exports.confirmInvoice = async (credentials, invoice_id) => {
    try {
        const response = await invoiceService.confirmInvoice(credentials, invoice_id);
        return response;
    } catch (e) {
        throw e
    }
};


