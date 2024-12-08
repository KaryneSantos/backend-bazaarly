require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/dataabase');


const app = express();
const port = 3000;


app.use(bodyParser.json());

// Rota de criação de usuário
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// Rota de login de usuário
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    console.log(`Server docs running on http://localhost:${port}/docs...`);
});