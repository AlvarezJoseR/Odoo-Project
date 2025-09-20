const axios = require('axios');
const URL = process.env.URL;

exports.login = async (db, username, password) => {
  const response = await axios.post(URL, {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "common",
      method: "login",
      args: [db, username, password]
    },
    id: new Date().getTime()
  });
  return response.data.result;
}