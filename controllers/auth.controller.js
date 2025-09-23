const authService = require('../services/auth.service.js');
const dbConnection = require('../db/db.connection.js');

//Auth 
exports.login = async (req, res) => {
    try {
        const { db, userName, password } = req.body;
        const response = await authService.login(db, userName, password);
        let query = `
                INSERT INTO logs (timestamp, request, status_code, response)
                VALUES (NOW(),  ?, ?, ?);
            `;
        // Log the request
        dbConnection.executeQuery(query, [req.originalUrl, response.statusCode, JSON.stringify(response)]);
        
        // Send response
        res.status(response.statusCode).json({ message: response.message, token: response.data });
    } catch (e) {
        const status = e.status || 500;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};