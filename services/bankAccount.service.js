const odooQuery = require('../helper/odoo.query');
const bankService = require('./bank.service');

exports.createBankAccount = async (credentials, data) => {
    try {
        const { db, uid, password } = credentials;
        const bank_account_data = { "acc_number": data.acc_number, "partner_id": data.partner_id, "bank_id": 0 };
        //If send bank id
        if (data.hasOwnProperty('bank_id')) {
            bank_account_data.bank_id = data.bank_id
        } else {
            //Find bank by name
            const bank = await bankService.getBank(credentials, [['name', 'ilike', data.bank_name]]);
            if (bank.data && bank.data.length === 1) {
                bank_account_data.bank_id = bank.data[0].id;
            } else {
                //create new bank
                const new_bank_id = await bankService.createBank(credentials, { "name": data.bank_name });
                bank_account_data.bank_id = new_bank_id.data;
            }
        }

        //Create bank account
        const bankAccount = await bankAccountService.getBankAccount(credentials, [['id', '=', bank_account_id]])
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "create", "res.partner.bank", [data], {}]);
        if (response.success === false && response.error === true) throw new Error('internal error')
        if (response.success === false) throw new Error('error creando la cuenta bancaria')
        return { statusCode: 200, message: "Cuenta bancaria creada.", data: response.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] };
    }
}

exports.deleteBankAcount = async (credentials, bank_account_id) => {
    try {
        const { db, uid, password } = credentials;
        //Verify valid id
        const id = Number(bank_account_id);

        if (isNaN(id)) {
            return { statusCode: 400, message: `El id ${id} no es un id valido.`, data: [] }
        }

        //Verify bank account exists
        const bank_account = await this.getBankAccount(credentials, [['id', "=", bank_account_id]]);
        if (!bank_account || bank_account.length === 0) return { statusCode: 404, message: `La cuenta bancaria con id '${bank_account_id}' no existe`, data: [] };

        //Delete bank account
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "write", "res.partner.bank", [[id], { active: false }], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error eliminando la cuenta bancaria.", data: [] }
        return { statusCode: 200, message: "Cuenta bancaria eliminada.", data: response.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] };
    }
}

exports.getBankAccountByFilters = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "search_read", "res.partner.bank", [filters], {}]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] }
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo las cuentas bancarias.", data: [] }
        return { statusCode: 200, message: "Cuentas bancarias obtenidas.", data: response.data };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

exports.getBankAccountById = async (credentials, bankAccountId) => {
    try {
        const response = this.getBankAccountByFilters(credentials, [['id', '=', bankAccountId]]);
        if (response.data.length === 0) return { statusCode: 404, message: `La cuenta bancaria con id '${bankAccountId}' no existe`, data: [] }
        return {statusCode: 200, message: "Cuenta bancaria obtenida.", data: response.data[0] };

    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}