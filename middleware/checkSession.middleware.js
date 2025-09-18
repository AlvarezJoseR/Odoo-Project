const { message } = require("../schemas/Customer/create.customer.schema");

const checkSession = (req, res, next) => {
    if (!req.session.hasOwnProperty('user') || !req.session.user.uid) {
        return res.status(401).json({ message: 'No estás logueado. Por favor, inicia sesión.' });
    }
    next();
};

module.exports = checkSession;