const axios = require('axios');
const URL = process.env.URL;
const odooQuery = require('../helper/odoo.query');

exports.createBankAccount = async (credentials, data) => {
    try {
        const response = await odooQuery.query(credentials, "create", "res.partner.bank", [data], {});
        return response;

    } catch (error) {
        throw new Error({
            'error': error
        });
    }
}

exports.deleteBankAcount = async (credentials, bank_account_id) => {
    try {
        //Verify valid id
        const id = parseInt(bank_account_id);

        if (isNaN(id)) {
            throw new Error('invalid ID' )
        }

        //Verify bank account exists
        const bank_account = await this.getBankAccount(credentials, [['id', "=", bank_account_id]]);
        if (!bank_account || bank_account.length === 0) throw new Error('bank account does not exist')

        //Delete Customer
        const response = await odooQuery.query(credentials, "write", "res.partner.bank", [[id], { active: false }]);
        return response;

    } catch (error) {
        throw error;
    }
}

exports.getBankAccount = async (credentials, filters = []) => {
    try {
        const response = await odooQuery.query(credentials, "search_read", "res.partner.bank", [filters], {});
        return response;

    } catch (error) {
        throw new Error({
            'error': error
        });
    }
}