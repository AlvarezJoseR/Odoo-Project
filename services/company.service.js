const axios = require('axios');
const URL = process.env.URL;

exports.getAllCompanies = async (credentials, filters = []) => {
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
                    {
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

                    }
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data.result;

    } catch (error) {
        throw error;
    }
}