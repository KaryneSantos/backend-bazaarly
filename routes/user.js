const express = require('express');
const router = express.Router();

const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

// Cadastrar um novo usuário

router.post('/', async (req, res) => {
    const { name, email, password, confirm_password, user_type } = req.body;
    const errors = [];

    if (!name || !email || !password || !confirm_password) {
        errors.push('Todos os campos são obrigatórios.');
        return res.status(400).json({ errors });
    }

    if(password.length < 8) {
        errors.push('A senha deve conter pelo menos 8 caracteres.');
        return res.status(400).json({ errors });
    }

    if(password != confirm_password){
        errors.push('As senhas não coincidem.');
        return res.status(400).json({ errors });
    }

    // Verifica se usuário já tem um cadastro
    const usuario_existe = await User.findOne({where: {email: email}});

    if(usuario_existe) {
        errors.push('Email já está em uso.');
        return res.status(400).json({ errors });
    }

    try {
        // Criptografando senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Criando um novo usuário
        const newUser = await User.create({ nome: name, email: email, senha: hashedPassword, tipo_usuario: user_type});
        const token = jwt.sign({ id: newUser.id, email: email }, process.env.secret, { expiresIn: '1h' });
        res.status(201).json({ user: email, token: token});
    } catch(error) {
        res.status(500).json(error);
    }

});

// Listar todos os usuários cadastrados

router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.status(200).json(users);
});

// Atualizar usuário

router.put('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // ID de usuário autenticado
        const {nome, email} = req.body 

        if(!nome && !email) {
            return res.status(400).json({ message: 'Preencha pelo menos um campo.' });
        }

        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        await user.update({
            nome:  nome && nome.trim() !== "" ? nome : user.nome,
            email: email && email.trim() !== "" ? email : user.email,
        });

        res.status(200).json({
            message: 'Usuário atualizado com sucesso!',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                telefone: user.telefone
            }
        });
    } catch(error) {
        console.error('Erro ao atualizar o usuário:', error);
        res.status(500).json({
            message: 'Erro ao atualizar o usuário.',
            error: error.message || error
        });
    }
});

// Deletar usuário

router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId; // ID de usuário autenticado

        const user = await User.findByPk(userId);
        console.log(user);

        if(!user) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        await user.destroy();
        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar o usuário:', error);
        res.status(500).json({ 
            message: 'Erro ao deletar o usuário.',
            error: error.message || error
        });
    }
});

module.exports = router;