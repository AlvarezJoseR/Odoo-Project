const odooQuery = require('../helper/odoo.query');

/**
 * Obtiene todas las compañías desde Odoo según los filtros proporcionados.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Array} [filters=[]] - Filtros para la búsqueda (por ejemplo: [['name', 'ilike', 'Compañía']]).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (lista de compañías o mensaje de error).
 *
 */
exports.getAllCompanies = async (credentials, filters = []) => {
    try {
        const { db, uid, password } = credentials;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, "res.company","search_read", [filters], {
            fields: [
                "name",
                "active",
                "email",
                "phone",
                "logo",
                "currency_id",
                "country_id",
                "state_id",
                "create_date",
                "user_ids",
            ]
        }]);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo las compañias.", data: [response.data.data.message] };
        return { statusCode: 200, message: "Compañias obtenidas.", data: response.data };
    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: [e.message] };
    }
}
