const odooQuery = require('../helper/odoo.query');


//Schemas
const createCustomerSchema = require('../schemas/Customer/create.customer.schema.js');

//Services
const bankAccountService = require('./bankAccount.service.js');

exports.getCustomerById = async (credentials, customer_id) => {
    try {
        const id = Number(customer_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify customer exists
        const response = await this.getCustomerByFilters(credentials, [['id', '=', customer_id]]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los clientes.", data: [] }
        if (!response || response.data.length === 0) return { statusCode: 404, message: `El cliente con id '${customer_id}' no existe`, data: [] };

        return { statusCode: 200, message: "Clientes obtenidos.", data: response.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}
/**
 *  Returns customers info 
 * @returns all customers info
 */
exports.getCustomerByFilters = async (credentials, filters = [], fields = [
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

        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los clientes.", data: [] }

        return { statusCode: 200, message: "Clientes obtenidos.", data: response.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

/**
 *  Create a new customer
 * @returns info customer created
 */
exports.createCustomer = async (credentials, data) => {
    try {
        const { db, uid, password } = credentials;
        let errors = [];
        const customer_fields = createCustomerSchema.describe().keys;
        const customer_data = {};

        //Prepare customer data
        for (const [key, value] of Object.entries(data)) {
            if (customer_fields.hasOwnProperty(key) && key != 'bank_account') {
                customer_data[key] = value;
            }
        }

        //create customer
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner", "create", [customer_data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error creando el cliente.", data: [] };

        //Create bank account
        if (data.hasOwnProperty('bank_account')) {
            for (const bank_account of data.bank_account) {
                bank_account.partner_id = response.data;

                await bankAccountService.createBankAccount(credentials, bank_account);

            }
        }

        //Return new customer data
        const new_customer = await this.getCustomerById(credentials, response.data);

        return { statusCode: 200, message: "Cliente creado.", data: new_customer.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] };
    }
}

/**
 *  Delete a customer
 * @returns A message if user deleted suscessfully
 */
exports.deleteCustomer = async (credentials, customer_id) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(customer_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify customer exists
        const customer = await this.getCustomerByFilters(credentials, [['id', "=", id]]);
        if (!customer || customer.data.length === 0) {
            return { statusCode: 404, message: `El cliente con id '${customer_id}' no existe`, data: [] };
        }

        //Delete Customer
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner", "write", [[id], { active: false }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error eliminando el cliente.", data: [] };
        return { statusCode: 200, message: "Cliente eliminado.", data: response.data };
    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] };
    }
}

/**
 *  Update a customer
 * @returns The updaded customer info
 */
exports.updateCustomer = async (credentials, customer_id, customer_data = {}) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(customer_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify customer exists
        const customer = await this.getCustomerById(credentials, customer_id);
        if (!customer || customer.data.length === 0) {
            return { statusCode: 404, message: `El cliente con id '${customer_id}' no existe`, data: [] };
        }

        //Update customer
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner", "write", [[id], customer_data], {}]);

        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error actualizando el cliente.", data: [] };

        //Return updated customer data
        const updated_customer = await this.getCustomerById(credentials, id);
        return { statusCode: 200, message: "Cliente actualizado.", data: updated_customer.data };
    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] };
    }
}

