const axios = require('axios');
const { error } = require('../schemas/BankAccount/create.bankAccount.schema');
const URL = process.env.URL;


/**
 *  Returns customers info 
 * @returns all customers info
 */
exports.getAllCustomer = async (credentials, filters = []) => {
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
                    "res.partner",
                    "search_read",
                    [filters],
                    {
                        fields: [
                            "id",
                            "name",
                            "email",
                            "phone",
                            "mobile",
                            "is_company",
                            "company_id",
                            "street",
                            "city",
                            "state_id",
                            "country_id",
                            "zip",
                            "customer_rank",
                            "active",
                            "vat",
                            "bank_ids"
                        ]
                    }
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

/**
 *  Create a new customer
 * @returns info customer created
 */
exports.createCustomer = async (credentials, data) => {
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
                    "res.partner",
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
        throw new Error({
            'error': error
        });
    }
}

/**
 *  Delete a customer
 * @returns A message if user deleted suscessfully
 */
exports.deleteCustomer = async (credentials, customer_id) => {
    try {
        //Verify valid id
        const id = parseInt(customer_id);

        if (isNaN(id)) {
            throw new error({ message: 'invalid ID' })
        }

        //Verify customer exists
        const customer = await this.getAllCustomer(credentials, [['id', "=", customer_id]]);
        if (!customer || customer.length === 0) throw new error({ message: 'customer does not exist' })

        //Delete Customer
        const { db, uid, password } = credentials

        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "res.partner", "write",
                    [[customer_id], { active: false }]
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}

/**
 *  Update a customer
 * @returns The updaded customer info
 */
exports.updateCustomer = async (credentials, customer_id, customer_data = {}) => {
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
                    "res.partner",
                    "write",
                    [[customer_id], customer_data],
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
        console.error(error.response?.data || error.message);
        throw new Error('Fallo en creacion');
    }
}

/**
 *  Get the customer model fields
 * @returns Returns a list of customers field
 */
exports.getCustomerfields = async (credentials) => {
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
                    "res.partner",
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
