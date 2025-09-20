const axios = require('axios');
const URL = process.env.URL;

exports.query = async (credentials, method, model, parameters = [], keys = {}) => {
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
                            model,
                            method,
                            parameters,
                            keys
                        ]
                    },
                    id: new Date().getTime()
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.data.hasOwnProperty('error'))
                     throw new Error(response.data.error.data.message)
        
                return response.data.result;
        
            } catch (error) {
                throw error
            }

};