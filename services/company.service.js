const axios = require('axios');
const URL = process.env.URL;

exports.getAllCompanies= async (credentials,  filters = []) => {
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
                    [filters],
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

exports.getCompanyfields = async (credentials,) => {
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