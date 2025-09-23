const odooQuery = require('../helper/odoo.query');
const jwt = require('jsonwebtoken');
exports.login = async (db, username, password) => {
  try {
    const response = await odooQuery.query("common", "login", [db, username, password]);
    if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
    if (response.success === false || response.data === false) return { statusCode: 400, message: "Error en las credenciales.", data: [] };

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