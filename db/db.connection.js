const mysql = require('mysql2/promise');
let pool;

const DbConfig = {
    async inicializar(config) {
        try {

            pool = mysql.createPool(config);
            const connection = await pool.getConnection();
            await connection.ping(); 
            connection.release();

            console.info("✅ Conexión a la base de datos verificada exitosamente.");
            return {
                status: true,
                message: "Conexión a la base de datos inicializada correctamente.",
            }
        } catch (error) {
            console.error("Error al inicializar la conexión a la base de datos: ", error);
            return {
                status: false,
                message: "Error al inicializar la conexión a la base de datos.",
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
     * @throws {Error} - Lanza un error si la consulta falla.
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
            return rows;
        } catch (error) {
            console.error("Error executing query: ", error);
            throw error;
        }
    },
};

module.exports = DbConfig;
