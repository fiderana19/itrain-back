const jwt = require('jsonwebtoken');
const ACCESS_TOKEN = '1234'

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if(!token) {
        return res.status(401).send({
            message: "Aucun jeton fourni !"
        }) 
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

        req.user = decoded;

        next();
    } catch (error) {
        res.status(400).json({ message: 'Token invalide.' });
    }

}

module.exports = authMiddleware;