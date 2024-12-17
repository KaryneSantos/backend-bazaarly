const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'API do site Bazaarly',
    description: 'Documentação CRUD - Projeto Bazaarly',
  },
  host: 'localhost:3000',
  schemes: ['http'], // Alterar para 'https' em produção
};

const outputFile = './swagger-output.json'; // Arquivo gerado
const endpointsFiles = ['./index.js']; // Arquivo(s) onde as rotas estão definidas

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./index.js'); // Inicia o servidor após a documentação ser gerada
});
