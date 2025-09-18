const express = require('express');
const bankAccountController = require('../controllers/bankAccount.controller.js');
const router = express.Router();
const createBankAccountSchema = require('./../schemas/BankAccount/create.bankAccount.schema.js');

//Validator
const sessionValidator = require('../middleware/checkSession.middleware.js');
const validator = require('../middleware/validate.middleware');
const bankAccountValidator = require('../middleware/validateBankAccount.middleware.js');

//bank account routes
router.post('/', sessionValidator, validator(createBankAccountSchema), bankAccountValidator, bankAccountController.createBankAccount);

module.exports = router;