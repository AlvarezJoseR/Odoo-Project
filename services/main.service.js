const customerService = require('./../services/customers.service');
const bankAccountService = require('./../services/bankAccount.service');
const bankService = require('./../services/bank.service');
const createCustomerSchema = require('../schemas/Customer/create.customer.schema');


exports.createCustomer = async (credentials, customer_info) => {
    //Create customer
    try {
        const customer_fields = createCustomerSchema.describe().keys;
        const customer_data = {};

        //Prepare customer data
        for (const [key, value] of Object.entries(customer_info)) {
            if (customer_fields.hasOwnProperty(key) && key != 'bank_account') {
                customer_data[key] = value;
            }
        }

        //create customer
        const customer_id = await customerService.createCustomer(credentials, customer_data);
        if (customer_id.hasOwnProperty('error'))
            throw new Error('customer creation error ' + response.error.data.message);

        //Create bank account
        if (customer_info.hasOwnProperty('bank_account')) {
            for (const bank_account of customer_info.bank_account) {
                //Prepare bank account data
                const bank_account_data = { "acc_number": bank_account.acc_number, "partner_id": customer_id, "bank_id": 0 };

                //If send bank id
                if (bank_account.hasOwnProperty('bank_id')) {
                    bank_account_data.bank_id = bank_account.bank_id
                } else {
                    //Find bank by name
                    const bank = await bankService.getBank(credentials, [['name', 'ilike', bank_account.bank_name]]);
                    if (bank && bank.length === 1) bank_account_data.bank_id = bank.id
                    else {
                        //create new bank
                        const new_bank_id = await bankService.createBank(credentials, { "name": bank_account.bank_name });
                        if (new_bank_id.hasOwnProperty('error'))
                            throw new Error('bank account creation error ' + bank_account_id.error.data.message);
                        bank_account_data.bank_id = new_bank_id
                    }
                }

                //Create bank account
                const bank_account_id = await bankAccountService.createBankAccount(credentials, bank_account_data);
                if (bank_account_id.hasOwnProperty('error'))
                    throw new Error('bank account creation error ' + bank_account_id.error.data.message);
            }
        }


        //Return new customer data
        const new_customer = await customerService.getAllCustomer(credentials, [['id', "=", customer_id]]);
        return (new_customer);

    } catch (e) {
        throw new Error(e);
    }
}
