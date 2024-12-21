    const express = require('express');
    const router = express.Router();

    const Product = require('../models/product');
    const authenticateToken = require('../middleware/auth');

    // Criar um novo produto

    router.post('/', authenticateToken, async(req, res) => {
        const {nome, descricao, preco, estoque} = req.body;

        const userId = req.userId;

        if (!nome || !descricao || !preco || !estoque) {
            return res.status(400).json({ error: 'Pelo menos um campo é obrigatório.' });
        }

        try {
            const vendedor = await Seller.findOne({ where: { userId: vendedorId } });
            console.log("Vendedor:", vendedor);
            if (!vendedor) {
                return res.status(404).json({ error: 'Vendedor não encontrado.' });
            }

            const [produto, created] = await Product.findOrCreate({
                where: {nome: nome, vendedorId: vendedorId},
                defaults: {
                    nome: nome,
                    descricao: descricao || '',
                    preco: preco, 
                    estoque: estoque || 0,
                    vendedorId: vendedorId
                },
            });

            if(!created) {
                return res.status(409).json({ error: 'Produto já existe.' });
            }

            res.status(201).json({message: 'Produto criado com sucesso!', produto});

            } catch(error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({
                message: 'Erro ao criar produto',
                error: error.message || error
            });
        }
    });

    module.exports = router;