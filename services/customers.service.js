const odooQuery = require('../helper/odoo.query');


//Schemas
const createCustomerSchema = require('../schemas/Customer/create.customer.schema.js');

//Services
const bankAccountService = require('./bankAccount.service.js');

/**
 * Obtiene un cliente por su ID desde Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} customer_id - ID del cliente a buscar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (cliente encontrado o mensaje de error).
 *
 */
exports.getCustomerById = async (credentials, customer_id) => {
    try {
        const id = Number(customer_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] };
        }

        //Verify customer exists
        const response = await this.getCustomerByFilters(credentials, [['id', '=', customer_id]]);
        if (response.statusCode === 500 ) return { statusCode: 500, message: "Error interno.", data: [response.data] }
        if (response.statusCode === 400) return { statusCode: 400, message: "Error obteniendo los clientes.", data: [response.data] }
        if (!response || response.data.length === 0) return { statusCode: 404, message: `El cliente con id '${customer_id}' no existe`, data: [] };
        return { statusCode: 200, message: "Clientes obtenidos.", data: response.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

/**
 * Obtiene clientes desde Odoo según los filtros proporcionados.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Array} [filters=[]] - Filtros para la búsqueda (por ejemplo: [['name', 'ilike', 'Cliente']]).
 * @param {Array} [fields] - Campos a obtener de Odoo.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (lista de clientes o mensaje de error).
 *
 */
exports.getCustomerByFilters = async (credentials, filters = [], fields = [
    "id",
    "name",
    "email",
    "phone",
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

        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los clientes.", data: [response.data.data.message] }

        return { statusCode: 200, message: "Clientes obtenidos.", data: response.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}


/**
 * Crea un nuevo cliente en Odoo y, si corresponde, sus cuentas bancarias asociadas.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Object} data - Datos del cliente a crear (puede incluir bank_account como array).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (cliente creado o mensaje de error).
 *
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
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error creando el cliente.", data: [response.data.data.message] };

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
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}


/**
 * Elimina (desactiva) un cliente en Odoo por su ID.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} customer_id - ID del cliente a eliminar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (resultado de la operación o mensaje de error).
 *
 */
exports.deleteCustomer = async (credentials, customer_id) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(customer_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${customer_id}' no es un id valido.`, data: [] };
        }

        //Verify customer exists
        const customer = await this.getCustomerByFilters(credentials, [['id', "=", id]]);
        if (!customer || customer.data.length === 0) {
            return { statusCode: 404, message: `El cliente con id '${customer_id}' no existe`, data: [] };
        }

        //Delete Customer
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner", "write", [[id], { active: false }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error eliminando el cliente.", data: [response.data.data.message] };
        return { statusCode: 200, message: "Cliente eliminado.", data: response.data };
    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}


/**
 * Actualiza un cliente en Odoo por su ID.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} customer_id - ID del cliente a actualizar.
 * @param {Object} customer_data - Datos a actualizar del cliente.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (cliente actualizado o mensaje de error).
 *
 */
exports.updateCustomer = async (credentials, customer_id, customer_data = {}) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(customer_id);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${customer_id}' no es un id valido.`, data: [] };
        }

        //Verify customer exists
        const customer = await this.getCustomerById(credentials, customer_id);
        if (!customer || customer.data.length === 0) {
            return { statusCode: 404, message: `El cliente con id '${customer_id}' no existe`, data: [] };
        }

        //Update customer
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner", "write", [[id], customer_data], {}]);

        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error actualizando el cliente.", data: [response.data.data.message] };

        //Return updated customer data
        const updated_customer = await this.getCustomerById(credentials, id);
        return { statusCode: 200, message: "Cliente actualizado.", data: updated_customer.data };
    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}

