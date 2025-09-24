const attachmentService = require('../services/attachment.service');


exports.getAttachment = async (req, res) => {
    try {
        const credentials = req.session.user;
        const response = await attachmentService.getAttachment(credentials);
        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.status || 500;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }

};

exports.deleteAttachment = async (req, res) => {
    try {
        const credentials = req.session.user;
        const attachment_id = req.params.id;
        const response = await attachmentService.deleteAttachment(credentials, attachment_id);

        res.status(response.statusCode).json(response);
    } catch (e) {
        const status = e.statusCode;
        const message = e.message;
        res.status(status).json({ status: status, message });
    }
};