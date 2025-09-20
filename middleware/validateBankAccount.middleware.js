const customerService = require('./../services/customers.service');
const bankAccountService = require('./../services/bankAccount.service');
const validateBankAccount = async (req, res, next) => {
    const bank_account_data = req.body;
    const credentials = req.session.user;
    const { bank_id, partner_id, acc_number } = bank_account_data;

    //Verify customer exists
    const customer = await customerService.getAllCustomer(credentials, [["id", "=", partner_id]]);
    if (!customer || customer.length === 0) return res.status(400).json({ error: `customer '${customer_id}' does not exist.` });

    //Verify customer does not have the same account
    const bankAccount = await bankAccountService.getBankAccount(credentials, [["bank_id", "=", bank_id], ["partner_id", "=", partner_id], ["acc_number", "=", acc_number]])
    if (bankAccount || bankAccount.length === 1) return res.status(400).json({ error: `The combination Account Number/Partner must be unique.` });

    next();
};

module.exports = validateBankAccount;