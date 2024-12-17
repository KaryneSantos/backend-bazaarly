require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const app = express();
const port = 3000;

app.use(bodyParser.json());

sequelize.sync({ force: false}).then(() => {
    console.log('Banco de dados sincronizado.');
}).catch(error => {
    console.error('Erro ao sincronizar o banco de dados:', error);
});

// Configuração da documentação Swagger

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Rota de CRUD de usuário
const userRouter = require('./routes/user');
app.use('/user', userRouter);

// Rota de login de usuário
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

// Rota de atualização de dados : Vendedor
const sellerRouter = require('./routes/seller');
app.use('/seller', sellerRouter);

// Rota de CRUD de produtos
const productRouter = require('./routes/product');
app.use('/product', productRouter);


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});