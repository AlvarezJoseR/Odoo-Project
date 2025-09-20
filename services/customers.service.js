const odooQuery = require('../helper/odoo.query');

/**
 *  Returns customers info 
 * @returns all customers info
 */
exports.getAllCustomer = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials
        const response = await odooQuery.query(
            credentials,
            "search_read",
            "res.partner",
            [filters], {
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
        });
        return response

    } catch (error) {
        throw error;
    }
}

/**
 *  Create a new customer
 * @returns info customer created
 */
exports.createCustomer = async (credentials, data) => {
    try {
        const response = odooQuery.query(credentials, "create", "res.partner", [data], {}); 
        return response;

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
            throw new Error('invalid ID')
        }

        //Verify customer exists
        const customer = await this.getAllCustomer(credentials, [['id', "=", id]]);
        if (!customer || customer.length === 0) throw new Error('customer does not exist')

        //Delete Customer

        const response = await odooQuery.query(credentials, "write", "res.partner", [[id], { active: false }], {});
        return response;

    } catch (error) {
        throw error;
    }
}

/**
 *  Update a customer
 * @returns The updaded customer info
 */
exports.updateCustomer = async (credentials, customer_id, customer_data = {}) => {
    try {
        //Verify valid id
        const id = parseInt(customer_id);

        if (isNaN(id)) {
            throw new Error('invalid ID')
        }

        //Verify customer exists
        const customer = await this.getAllCustomer(credentials, [['id', "=", customer_id]]);
        if (!customer || customer.length === 0) throw new Error('customer does not exist')

        const response = await odooQuery.query(credentials, "write", "res.partner", [[id], customer_data], {});
        return response;
    } catch (error) {

        throw error;
    }
}

