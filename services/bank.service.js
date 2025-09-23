const odooQuery = require('../helper/odoo.query');

exports.createBank = async (credentials, data) => {
    try {
        const {db, uid, password} = credentials;
        const response = await odooQuery.query("object", "execute_kw",[db, uid, password, "create", "res.bank", [data], {}] );
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error creando el banco.", data: [] };
        return { statusCode: 200, message: "Banco creado.", data: response.data };

    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}

exports.getBank = async (credentials, filters = []) => {
    try {
        const {db, uid, password} = credentials;
        const response = await odooQuery.query("object", "execute_kw",[db, uid, password, "search_read", "res.bank", [filters], {}] );
        if (response.success === false && response.error === true) return { statusCode: 500, message: "Error interno.", data: [] };
        if (response.success === false) return { statusCode: 400, message: "Error obteniendo los bancos.", data: [] };
        return { statusCode: 200, message: "Bancos obtenidos.", data: response.data };
    } catch (e) {
        console.error(e);
        return { statusCode: 500, message: "Error interno.", data: [] }
    }
}