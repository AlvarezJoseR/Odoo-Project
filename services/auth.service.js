const odooQuery = require('../helper/odoo.query');
const jwt = require('jsonwebtoken');
const logsRepository = require('../db/Logs/logs.repositoy.js');

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
exports.login = async (db, username, password, req) => {
  try {
   // Realiza la llamada a Odoo para autenticar al usuario
    const response = await odooQuery.query("common", "login", [db, username, password],);

    let res = {};

    if (response.success === false && response.error === true) {
      //Error interno de odoo
      res = { statusCode: 500, message: "Error interno.", data: [response.data] };
    } else if (response.success === false || response.data === false) {
      //Credenciales invalidas
      res = { statusCode: 400, message: "Error en las credenciales.", data: [response.data] };
    } else {
      //Login exitoso, genera el token JWT
      var token = jwt.sign({
        db,
        uid: response.data,
        password,
      }, 'shhhhh', { expiresIn: '1h' });
      
      res = { statusCode: 200, message: "Login exitoso.", data: token };
    }
    // Genera
    logsRepository.createLogs([req.originalUrl, res.statusCode, JSON.stringify(res), req.method]);
    return res;

  } catch (e) {
    console.error(e);
    return { statusCode: 500, message: "Error interno.", data: [] }
  }
}