const odooQuery = require('../helper/odoo.query');

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
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo las compañias.", data: [] };
        return { statusCode: 200, message: "Compañias obtenidas.", data: response.data };
    } catch (e) {
        return { statusCode: 500, message: "Error interno.", data: []};
    }
}
