const express = require('express');
const router = express.Router();
 
//Middleware
const sessionValidator = require('../middleware/checkSession.middleware.js'); 

//Controller
const attachmentController = require('../controllers/Attachment.controller.js');

//Auth Routes
router.get('/', sessionValidator, attachmentController.getAttachment);
router.delete('/:id', sessionValidator, attachmentController.deleteAttachment);
module.exports = router;