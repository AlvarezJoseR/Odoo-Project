const odooQuery = require('../helper/odoo.query');
const bankService = require('./bank.service');

/**
 * Crea una nueva cuenta bancaria en Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Object} data - Datos de la cuenta bancaria a crear (por ejemplo: { acc_number, partner_id, bank_id, bank_name }).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (cuenta bancaria creada o mensaje de error).
 *
 */
exports.createBankAccount = async (credentials, data) => {
    try {
        const { db, uid, password } = credentials;
        const bank_account_data = { "acc_number": data.acc_number, "partner_id": data.partner_id, "bank_id": 0 };
        //If send bank id use it, if not find by name or create new bank
        if (data.hasOwnProperty('bank_id')) {
            bank_account_data.bank_id = data.bank_id
        } else {
            //Find bank by name or create new
            const bank = await bankService.getBank(credentials, [['name', 'ilike', data.bank_name]]);
            if (bank.data && bank.data.length === 1) {
                bank_account_data.bank_id = bank.data[0].id;
            } else {
                //create new bank and use id
                const new_bank_id = await bankService.createBank(credentials, { "name": data.bank_name });
                bank_account_data.bank_id = new_bank_id.data;
            }
        }

        //Create bank account 
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner.bank", "create", [data], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error creando la cuenta bancaria.", data: [response.data.data.message] };
        const bankAccount = await this.getBankAccountById(credentials, response.data)
        return { statusCode: 200, message: "Cuenta bancaria creada.", data: bankAccount.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}

/**
 * Elimina (desactiva) una cuenta bancaria en Odoo por su ID.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} bank_account_id - ID de la cuenta bancaria a eliminar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (resultado de la operación o mensaje de error).
 *
 */
exports.deleteBankAcount = async (credentials, bank_account_id) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(bank_account_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] }
        }

        //Verify bank account exists
        const bank_account = await this.getBankAccountById(credentials, id);
        if (bank_account.statusCode == 404) {
            return bank_account;
        }
        //Delete bank account
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner.bank", "write", [[id], { active: false }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] }
        if (response.success === false) return { statusCode: 400, message: "Error eliminando la cuenta bancaria.", data: [response.data.data.message] }
        return { statusCode: 200, message: "Cuenta bancaria eliminada.", data: response.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}

/**
 * Obtiene cuentas bancarias desde Odoo según los filtros proporcionados.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Array} [filters=[]] - Filtros para la búsqueda (por ejemplo: [['acc_number', 'ilike', '123']]).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (lista de cuentas o mensaje de error).
 *
 */
exports.getBankAccountByFilters = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.partner.bank", "search_read", [filters], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo las cuentas bancarias.", data: [response.data.data.message] }
        return { statusCode: 200, message: "Cuentas bancarias obtenidas.", data: response.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

/**
 * Obtiene una cuenta bancaria por su ID desde Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {number|string} bankAccountId - ID de la cuenta bancaria a buscar.
 * @returns {Promise<Object>} Objeto con statusCode, message y data (cuenta encontrada o mensaje de error).
 *
 */
exports.getBankAccountById = async (credentials, bankAccountId) => {
    try {

        const id = Number(bankAccountId);
        if (isNaN(id)) {
            return { statusCode: 400, message: `El id '${bankAccountId}' no es un id de cuenta bancaria valido.`, data: [] }
        }

        const response = await this.getBankAccountByFilters(credentials, [['id', '=', bankAccountId]]);

        if (response.data.length === 0) return { statusCode: 404, message: `La cuenta bancaria con id '${bankAccountId}' no existe`, data: [response.data.data.message] }
        return { statusCode: 200, message: "Cuenta bancaria obtenida.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}