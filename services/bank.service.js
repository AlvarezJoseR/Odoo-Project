const odooQuery = require('../helper/odoo.query');

/**
 * Crea un nuevo banco en Odoo.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Object} data - Datos del banco a crear (por ejemplo: { name: 'Banco Ejemplo' }).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (id del banco creado o mensaje de error).
 *
 */
exports.createBank = async (credentials, data) => {
    try {
        const {db, uid, password} = credentials;
        
        const response = await odooQuery.query("object", "execute_kw",[db, uid, password, "res.bank", "create", [data], {}] );
        console.log(response);
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error creando el banco.", data: [response.data.data.message] };
        return { statusCode: 200, message: "Banco creado.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}

/**
 * Obtiene bancos desde Odoo según los filtros proporcionados.
 *
 * @async
 * @param {Object} credentials - Credenciales de acceso a Odoo (debe incluir db, uid y password).
 * @param {Array} [filters=[]] - Filtros para la búsqueda (por ejemplo: [['name', 'ilike', 'Banco']]).
 * @returns {Promise<Object>} Objeto con statusCode, message y data (lista de bancos o mensaje de error).
 *
 */
exports.getBank = async (credentials, filters = []) => {
    try {
        const {db, uid, password} = credentials;
        const response = await odooQuery.query("object", "execute_kw",[db, uid, password, "res.bank", "search_read", [filters], {}] );
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [response.data.data.message] };
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los bancos.", data: [response.data.data.message] };
        return { statusCode: 200, message: "Bancos obtenidos.", data: response.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [e.message] }
    }
}