const axios = require('axios');
const URL = process.env.URL;

exports.createBank = async (credentials, data) => {
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
                        "res.bank",
                        "create",
                        [data],
                        {}
                    ]
                },
                id: new Date().getTime()
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.data.hasOwnProperty('error'))
                return response.data;
    
            return response.data.result;
    
        } catch (error) {
            throw new Error({
                'error': error
            });
        }
}

exports.getBank = async (credentials, filters = []) => {
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
                    "res.bank",
                    "search_read",
                    [filters],
                    {}
                ]
            },
            id: new Date().getTime()
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.hasOwnProperty('error'))
            return response.data;

        return response.data.result;

    } catch (error) {
        throw new Error({
            'error': error
        });
    }
}