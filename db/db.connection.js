const mysql = require('mysql2/promise');
let pool;

const DbConfig = {
    /**
 * Inicializa una conexión a la base de datos MySQL usando un pool de conexiones.
 *
 * Verifica que la base de datos esté accesible mediante un `ping()`.
 * Si la conexión es exitosa, devuelve un objeto con `statusCode 200`.
 * Si ocurre un error, devuelve un objeto con `statusCode 500`.
 *
 * @async
 * @function
 * @param {Object} config - Objeto de configuración para la base de datos. Debe incluir:
 *   @param {string} config.host - Dirección del host (ej. 'localhost').
 *   @param {string} config.user - Usuario de la base de datos.
 *   @param {string} config.password - Contraseña del usuario.
 *   @param {string} config.database - Nombre de la base de datos.
 *   @param {number} [config.port=3306] - Puerto de conexión (opcional).
 *   @param {number} [config.connectionLimit=10] - Número máximo de conexiones en el pool (opcional).
 *
 * @returns {Promise<Object>} Objeto con:
 *   - `statusCode` {number} - 200 si la conexión fue exitosa, 500 si falló.
 *   - `message` {string} - Mensaje descriptivo del resultado.
 *   - `data` {Array} - Array vacío (puede contener datos en el futuro).
     */
    async inicializar(config) {
        try {

            pool = mysql.createPool(config);


            const connection = await pool.getConnection();
            await connection.ping();
            connection.release();

            console.info("✅ Conexión a la base de datos establecida correctamente.");

            return {
                statusCode: 200,
                message: "Conexión a la base de datos inicializada correctamente.",
                data: [],
            };
        } catch (error) {
            console.error("❌ Error al conectar con la base de datos:", error.message);

            return {
                statusCode: 500,
                message: "Error al inicializar la conexión a la base de datos.",
                data: [],
            };
        }
    },


    /**
     * Ejecuta una consulta SQL utilizando el pool de conexiones MySQL.
     * 
     * Utiliza prepared statements internamente para prevenir inyecciones SQL.
     * Devuelve el resultado de la consulta como un array de filas.
     *
     * @async
     * @function
     * @param {string} query - La consulta SQL a ejecutar. Puede contener placeholders (`?`) para parámetros.
     * @param {Array<*>} [params=[]] - Parámetros que reemplazarán los placeholders en la consulta SQL.
     * @returns {Promise<Array<Object>>} - Una promesa que se resuelve con un array de filas del resultado.
     *
     * @example
     * const registros = await executeQuery(
     *   "SELECT * FROM logs_peticiones WHERE estado = ? LIMIT ?",
     *   ['ERROR', 10]
     * );
     */
    async executeQuery(query, params = []) {
        try {
            const [rows] = await pool.execute(query, params);
            return { statusCode: 200, message: "Consulta ejecutada correctamente.", data: rows };
        } catch (error) {
            console.error("Error executing query: ", error);
            return { statusCode: 500, message: "Error ejecutando la consulta.", data: [] };
        }
    },
};

module.exports = DbConfig;
