const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Seller = require('../models/seller');
const authenticateToken = require('../middleware/auth');

// Atualizar tipo de usuário para vendedor

router.put('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // ID de usuário autenticado
        const { nome_da_loja, endereco_comercial, telefone } = req.body;

        if (!nome_da_loja || !endereco_comercial || !telefone) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (user.tipo_usuario === 'vendedor') {
            return res.status(409).json({ message: 'Usuário já é um vendedor.' });
        }

        user.tipo_usuario = 'vendedor';
        await user.save();

        const vendedor = await Seller.create({
            nome: user.nome,
            userId: user.id,
            nome_da_loja,
            endereco_comercial,
            telefone
        });

        return res.status(200).json({
            message: 'Usuário promovido a vendedor com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                tipo_usuario: user.tipo_usuario,
                vendedor: {
                    nome_da_loja: vendedor.nome_da_loja,
                    endereco_comercial: vendedor.endereco_comercial,
                    telefone: vendedor.telefone
                }
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar usuário para vendedor:', error);
        return res.status(500).json({
            message: 'Erro ao atualizar usuário para vendedor.',
            error: error.message || error
        });
    }
});

// Listar todos os vendedores

router.get('/', async (req, res) => {
    const users = await Seller.findAll();
    res.status(200).json(users);
});

// Atualizar dados do vendedor

router.put('/update', authenticateToken, async (req, res) => {
    try {
        const vendedorId = req.userId; // ID de usuário autenticado
        const {nome_da_loja, endereco_comercial, telefone} = req.body;

        if(!nome_da_loja, endereco_comercial, telefone) {
            return res.status(400).json({ message: 'Preencha pelo menos um campo.' });
        }

        const seller = await Seller.findByPk(vendedorId);

        if(!seller) {
            return res.status(404).json({message: 'Vendedor não encontrado.'});
        }

        await seller.update({
            nome_da_loja:  nome_da_loja && nome_da_loja.trim() !== "" ? nome_da_loja : seller.nome_da_loja,
            endereco_comercial: endereco_comercial && endereco_comercial.trim() !== "" ? endereco_comercial : seller.endereco_comercial,
            telefone: telefone && telefone.trim() !== "" ? telefone : seller.telefone
        });

        res.status(200).json({
            message: 'Vendedor atualizado com sucesso!',
            seller: {
                id: seller.id,
                nome: seller.nome_da_loja,
                email: seller.endereco_comercial,
                telefone: seller.telefone
            }
        });
    } catch(error) {
        console.error('Erro ao atualizar o vendedor:', error);
        res.status(500).json({
            message: 'Erro ao atualizar o vendedor.',
            error: error.message || error
        });
    }
});

// Deletar vendedor

router.delete('/delete', authenticateToken, async(req, res) => {
    try {
        const vendedorId = req.userId; // ID de usuário autenticado

        const seller = await Seller.findByPk(vendedorId);

        if(!seller) {
            return res.status(404).json({message: 'Vendedor não encontrado.'});
        }

        await seller.destroy();
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar o usuário:', error);
        res.status(500).json({ 
            message: 'Erro ao deletar o usuário.',
            error: error.message || error
        });
    }
})

module.exports = router;