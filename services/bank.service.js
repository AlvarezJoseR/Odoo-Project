const odooQuery = require('../helper/odoo.query');

exports.createBank = async (credentials, data) => {
    try {
            const response = await odooQuery.query(credentials, "create", "res.bank", [data], {});
            return response;
    
        } catch (e) {
            throw e
        }
}

exports.getBank = async (credentials, filters = []) => {
    try {
        const response = await odooQuery.query(credentials, "search_read", "res.bank", [filters], {});
        return response;

    } catch (e) {
        throw e
    }
}