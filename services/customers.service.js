const odooQuery = require('../helper/odoo.query');
const { message } = require('../schemas/BankAccount/create.bankAccount.schema');

/**
 *  Returns customers info 
 * @returns all customers info
 */
exports.getAllCustomer = async (credentials, filters = [], fields = [
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
]) => {
    try {
        const { db, uid, password } = credentials;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner", "search_read", [filters], { fields }]);
        if (response.success === false) return {statusCode: 400, message: "Error obtniendo los clientes.", data: []}
        if (response.success === false && response.error === true) return {statusCode: 500, message: "Error interno.", data: []}

        //throw new Error(response.error.message || 'Error retrieving customers')
            return {statusCode: 200, message: "Clientes obtenidos.", data: response.data};
    } catch (e) {
        console.error(e);
        return {statusCode: 500, message: "Error interno.", data: []}
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
    } catch (e) {
        throw e
    }
}

/**
 *  Delete a customer
 * @returns A message if user deleted suscessfully
 */
exports.deleteCustomer = async (credentials, customer_id) => {
    try {
        //Verify valid id
        const id = Number(customer_id);

        if (isNaN(id)) {
            const error = new Error(`Id '${customer_id}' is not an ID valid.`);
            error.status = 400;
            throw error;
        }

        //Verify customer exists
        const customer = await this.getAllCustomer(credentials, [['id', "=", id]]);
        if (!customer || customer.length === 0) {
            const error = new Error(`customer with id '${customer_id}' does not exist`);
            error.status = 404;
            throw error;
        }

        //Delete Customer
        const response = await odooQuery.query(credentials, "write", "res.partner", [[id], { active: false }], {});
        return response;

    } catch (e) {
        throw e;
    }
}

/**
 *  Update a customer
 * @returns The updaded customer info
 */
exports.updateCustomer = async (credentials, customer_id, customer_data = {}) => {
    try {
        //Verify valid id
        const id = Number(customer_id);
        if (isNaN(id)) {
            const error = new Error(`Id '${customer_id}' is not an ID valid.`);
            error.status = 400;
            throw error;
        }

        //Verify customer exists
        const customer = await this.getAllCustomer(credentials, [['id', "=", customer_id]]);
        if (!customer || customer.length === 0) {
            const error = new Error(`customer with id '${customer_id}' does not exist`);
            error.status = 404;
            throw error;
        }

        const response = await odooQuery.query(credentials, "write", "res.partner", [[id], customer_data], {});
        return response;
    } catch (e) {
        throw e;
    }
}

