const axios = require('axios');
const URL = process.env.URL;

exports.getAllCompanies= async (credentials) => {
    try {
        const { db, uid, password } = credentials
        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "res.company",
                    "search_read",
                    [],
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.result;

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}

/**
 *  Get the customer model fields
 * @returns Returns a list of customers field
 */
exports.getCompanyfields = async (credentials) => {
    try {
         const { db, uid, password } = credentials

        const response = await axios.post(URL, {
            jsonrpc: "2.0",
            method: "call",
            params: {
                service: "object",
                method: "execute_kw",
                args: [
                    db, uid, password,
                    "res.company",
                    "fields_get",
                    [],
                    { attributes: ["string", "help", "type"] }
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data.result;

    } catch (error) {
        console.error(error.response?.data || error.message);
        throw error;
    }
}