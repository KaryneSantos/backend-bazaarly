require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.secret;


// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['Authorization'];
    console.log('Token recebido no backend:', token);

    jwt.verify(token, secret, (err, decoded) => {
        if (err){ return res.status(403).json({ error: 'Token inválido.' });}

        req.email = decoded.email;
        next();
    });
};

module.exports = authenticateToken;