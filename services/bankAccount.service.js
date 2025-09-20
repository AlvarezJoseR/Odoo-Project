const axios = require('axios');
const URL = process.env.URL;

exports.createBankAccount = async (credentials, data) => {
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
                    "res.partner.bank",
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

exports.deleteBankAcount = async (credentials, bank_account_id) => {
    try {
        //Verify valid id
        const id = parseInt(bank_account_id);

        if (isNaN(id)) {
            throw new Error('invalid ID' )
        }

        //Verify customer exists
        const bank_account = await this.getBankAccount(credentials, [['id', "=", bank_account_id]]);
        if (!bank_account || bank_account.length === 0) throw new Error('bank account does not exist')

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
                    "res.partner.bank", "write",
                    [[id], { active: false }]
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;

    } catch (error) {
        throw error;
    }
}

exports.getBankAccount = async (credentials, filters = []) => {
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
                    "res.partner.bank",
                    "search_read",
                    [filters],
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