const express = require('express');
const authController = require('../controllers/auth.controller');
const loginSchema = require('../schemas/Auth/login.schema');
const router = express.Router();
const validator = require('../middleware/validate.middleware');

//Auth routes
router.post('/', validator(loginSchema), authController.login);


module.exports = router;