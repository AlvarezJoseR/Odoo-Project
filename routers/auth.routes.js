const express = require('express');
const router = express.Router();
//Middleware
const validator = require('../middleware/validate.middleware');

//Schemas
const loginSchema = require('../schemas/Auth/login.schema');

//Controller
const authController = require('../controllers/auth.controller');

//Auth Routes
router.post('/login', validator(loginSchema), authController.login);

module.exports = router;