const express = require('express');
const router = express.Router();
//Middleware
const validator = require('../middleware/validate.middleware');
const sessionValidator = require('../middleware/checkSession.middleware.js');   

//Schemas
const createBankAccountSchema = require('../schemas/BankAccount/create.bankAccount.schema');

//Controller
const bankAccountController = require('../controllers/bankAccount.controller.js');

//Auth Routes
router.post('/', sessionValidator, validator(createBankAccountSchema), bankAccountController.createBankAccount);
router.delete('/:id', sessionValidator, bankAccountController.deleteBankAccount);
router.get('/:id', sessionValidator, bankAccountController.getBankAccountById);
module.exports = router;