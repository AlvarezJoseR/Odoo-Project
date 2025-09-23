const authService = require('../services/auth.service.js');


//Auth 
exports.login = async (req, res) => {
    try {
        const { db, userName, password } = req.body;
        const response = await authService.login(db, userName, password);

        res.status(response.statusCode).json({token: response.data});
    } catch (e) {
        const status = e.status || 500;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};