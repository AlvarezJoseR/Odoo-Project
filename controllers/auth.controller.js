const AUTH = require('./../services/auth.service')
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { db, userName, password } = req.body;
        const response = await AUTH.login(db, userName, password);

        var token = jwt.sign({
            db,
            uid: response,
            password,
        }, 'shhhhh', { expiresIn: '1h' });
    
        res.status(200).json({ message: "Successful login" , token: token});
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};