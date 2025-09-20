const odooQuery = require('../helper/odoo.query');

exports.getAllCompanies = async (credentials, filters = []) => {
    try {
        const response = await odooQuery.query(credentials, "search_read", "res.company", [filters], {
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
        });
        return response;
    } catch (error) {
        throw error;
    }
}