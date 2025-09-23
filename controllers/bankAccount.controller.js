const bankAccountService = require('../services/bankAccount.service.js');

//Bank Accounts
exports.createBankAccount = async (req, res) => {
    try {
        const credentials = req.session.user;
        const bank_account_data = req.body;
        const response = await bankAccountService.createBankAccount(credentials, bank_account_data);
        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode || 500;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.deleteBankAccount = async (req, res) => {
    try {
        const credentials = req.session.user;
        const bank_account_id = req.params.id;
        const response = await bankAccountService.deleteBankAcount(credentials, bank_account_id);
        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.getBankAccountById = async (req, res) => {
    try {
        const credentials = req.session.user;
        const bank_account_id = req.params.id;
        const response = await bankAccountService.getBankAccountById(credentials, bank_account_id);
        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};