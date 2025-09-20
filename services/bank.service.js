const axios = require('axios');
const URL = process.env.URL;
const odooQuery = require('../helper/odoo.query');

exports.createBank = async (credentials, data) => {
    try {
            const response = await odooQuery.query(credentials, "create", "res.bank", [data], {});
            return response;
    
        } catch (error) {
            throw new Error({
                'error': error
            });
        }
}

exports.getBank = async (credentials, filters = []) => {
    try {
        const response = await odooQuery.query(credentials, "search_read", "res.bank", [filters], {});
        return response;

    } catch (error) {
        throw new Error({
            'error': error
        });
    }
}