const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Seller = require('../models/seller');
const authenticateToken = require('../middleware/auth');

router.put('/', authenticateToken, async (req, res) => {
    try {

        const userId = req.userId; // ID de usuário autenticado
        console.log("ID do usuário autenticado:", userId);
        
        const {nome_da_loja, endereco_comercial, telefone} = req.body;
        console.log('Nome da loja:', nome_da_loja);
        console.log('Endereço comercial:', endereco_comercial);
        console.log('Telefone:', telefone);

        const errors = [];

        if(!nome_da_loja || !endereco_comercial || !telefone) {
            errors.push('Todos os campos são obrigatórios.');
            return res.status(400).json({ errors });
        }

        const user = await User.findByPk(userId);
        console.log("Usuário encontrado:", user);

        if(!user) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        if(user.tipo_usuario !== 'comprador') {
            return res.status(400).json({ message: 'O usuário não é um comprador.' });
        }

        user.tipo_usuario = 'vendedor';
        await user.save();
        console.log("Tipo de usuário do usuário após a atualização:", user.tipo_usuario);


        const vendedor = await Seller.create({
            nome: user.nome,
            userId: user.id,
            nome_da_loja: nome_da_loja,
            endereco_comercial: endereco_comercial,
            telefone: telefone
        });

        res.status(200).json({
            message: 'Usuário promovido a vendedor com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo_usuario: user.tipo_usuario,
                nome_da_loja: vendedor.nome_da_loja,
                endereco_comercial: vendedor.endereco_comercial,
                telefone: vendedor.telefone
            }
        });

    } catch(error) {
        console.error('Erro a atualizar o usuário para vendedor:', error);
        res.status(500).json({ 
            message: 'Erro a atualizar o usuário para vendedor.',
            error: error.message || error
        });
    }
});

module.exports = router;