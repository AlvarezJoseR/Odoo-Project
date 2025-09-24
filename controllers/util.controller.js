const utilService = require('../services/util.service');


exports.getModel = async (req, res) => {
    try {
        const credentials = req.session.user;
        const model = req.query.name
        const response = await utilService.getModel(credentials, model);
        res.status(response.statusCode).json({ message: response.message, token: response.data });
    } catch (e) {
        const status = e.status || 500;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};