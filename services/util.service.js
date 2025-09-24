const odooQuery = require('../helper/odoo.query');


exports.getModel = async (credentials, model) => {
    try {
        const { db, uid, password } = credentials;
        const response = await odooQuery.query("object", "execute_kw", [db, uid, password, model, "fields_get", [], { attributes: ["help", "string", "type"] }]);
        let res = {};

        if (response.success === false && response.error === true) {
            //Error interno de odoo
            res = { statusCode: 500, message: "Error interno.", data: [response.data] };
        } else if (response.success === false || response.data === false) {
            //Credenciales invalidas
            res = { statusCode: 400, message: "Error en la consulta de modelo", data: [response.data] };
        } else {
            res = { statusCode: 200, message: "Modelo", data: response };
        }
        return res;

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}