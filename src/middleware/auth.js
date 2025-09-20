const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).send({
            message: "Aucun jeton fourni !"
        }) 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).json({ message: 'Token invalide.' });
    }

}

module.exports = authMiddleware;