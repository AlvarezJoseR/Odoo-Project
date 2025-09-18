const AUTH = require('./../services/auth.service')

exports.login = async (req, res) => {
    try {
        const { db, userName, password } = req.body;
        const response = await AUTH.login(db, userName, password);
        req.session.user = {
            db,
            uid: response,
            password,
        };
        res.status(200).json({message: "Successful login"});
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};