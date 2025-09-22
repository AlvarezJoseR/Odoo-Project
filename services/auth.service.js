const odooQuery = require('../helper/odoo.query');

exports.login = async (db, username, password) => {
  try {
    const response = await odooQuery.query("common", "login", [db, username, password]);
    return response;
  } catch (e) {
    throw e;
  }
}