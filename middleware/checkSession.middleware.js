const jwt = require('jsonwebtoken');

const checkSession = (req, res, next) => {
    const token = req.headers['token'] || req.headers['Token'];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'shhhhh');
        req.session.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = checkSession;