require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.secret;


// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Token recebido no backend:', token);

    jwt.verify(token, secret, (err, decoded) => {
        if (err){ return res.status(403).json({ error: 'Token inválido.' });}

        console.log('Token decoficado:', decoded);

        req.userId = decoded.userId;
        console.log('ID armazenado em req.userId:', req.userId);
        next();
    });
};

module.exports = authenticateToken;