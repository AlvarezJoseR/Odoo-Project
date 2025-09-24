const e = require('express');
const dbConnection = require('./../db.connection');

const logsRepository = {

    /**
     * Inserta un nuevo registro en la tabla `logs`.
     *
     * @async
     * @param {Array} logData - Datos del log en orden: [request, status_code, response, method].
     * @returns {Promise<Object>} Resultado con statusCode, message y data.
     *
     * @example
     * await createLogs(['/api/login', 200, '{"ok":true}', 'POST']);
     */
    async createLogs(logData = []) {
        try {
            const query = `
                INSERT INTO logs (timestamp, request, status_code, response, method)
                VALUES (NOW(), ?, ?, ?, ?);
            `;

            // const query = `INSERT INTO odoo_request_logs (service, method, args, response, created_at ) VALUES (?, ?, ?, ?, NOW())`

            const result = await dbConnection.executeQuery(query, logData);
            return result;
        } catch (error) {
            console.error("❌ Error al conectar con la base de datos:", error.message);

            return {
                statusCode: 500,
                message: "Error al insertar el log en la base de datos.",
                data: [e],
            };
        }
    },

};

module.exports = logsRepository;