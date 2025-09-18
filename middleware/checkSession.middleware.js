const checkSession = (req, res, next) => {
    if (!req.session.hasOwnProperty('user') || !req.session.user.uid) {
        return res.status(401).send('No estás logueado. Por favor, inicia sesión.');
    }
    next(); 
};

module.exports =  checkSession;