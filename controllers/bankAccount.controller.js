const bankAccountService = require('./../services/bankAccount.service')
exports.createBankAccount = async (req, res) => {
    try {
        const bank_account_data = req.body;
        const credentials = req.session.user;
        const response = await bankAccountService.createBankAccount(credentials, bank_account_data)

        if (response.hasOwnProperty('error'))
            res.status(400).json({ error: 'creation error', message: response.error.data.message });

        res.status(200).json({message: `Bank Account Created id ${response}`})
    } catch (e) {
        res.status(500).json(e);
    }


};