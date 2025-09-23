const odooQuery = require('../helper/odoo.query');
const jwt = require('jsonwebtoken');

/**
 * Realiza el proceso de autenticación contra un servidor Odoo y genera un token JWT si las credenciales son válidas.
 *
 *
 * @async
 * @function
 * @param {string} db - Nombre de la base de datos de Odoo a la que se desea conectar.
 * @param {string} username - Nombre de usuario (email o login) para autenticarse.
 * @param {string} password - Contraseña del usuario.
 *
 * @returns {Promise<Object>} Un objeto que contiene:
 *  - `statusCode` {number} - Código HTTP simulado para interpretar el resultado (200, 400, 500).
 *  - `message` {string} - Mensaje descriptivo del resultado.
 *  - `data` {string|Array} - Si el login es exitoso, contiene el token JWT. En caso contrario, es un array vacío.
 *
 */
exports.login = async (db, username, password) => {
  try {
    const response = await odooQuery.query("common", "login", [db, username, password],);
    if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
    if (response.success === false || response.data === false) return { statusCode: 400, message: "Error en las credenciales.", data: [response.data.data.message] };

    var token = jwt.sign({
      db,
      uid: response.data,
      password,
    }, 'shhhhh', { expiresIn: '1h' });
    return { statusCode: 200, message: "Login exitoso.", data: token };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, message: "Error interno.", data: [] }
  }
}