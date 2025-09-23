const authService = require('../services/auth.service.js');
const logsRepository = require('../db/Logs/logs.repositoy.js');

//Auth 
exports.login = async (req, res) => {
    try {
        const { db, userName, password } = req.body;
        const response = await authService.login(db, userName, password, req);

        // Log the request
        logsRepository.createLogs([req.originalUrl, response.statusCode, JSON.stringify(response), req.method]);
        res.status(response.statusCode).json({ message: response.message, token: response.data });
    } catch (e) {
        const status = e.status || 500;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};