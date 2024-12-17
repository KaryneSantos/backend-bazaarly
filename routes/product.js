const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Seller = require('../models/seller');
const Product = require('../models/product');
const authenticateToken = require('../middleware/auth');

// Criar um novo produto

router.post('/', authenticateToken, async(req, res) => {
    const {nome, preco} = req.body;

    const vendedorId = req.userId;

    if (!nome || !preco) {
        return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }
});

module.exports = router;