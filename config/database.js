const {Sequelize} = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_user,
    process.env.db_pass,
    {
        host: process.env.db_host,
        port: 3306,
        dialect: 'mysql'
    }
);

module.exports = sequelize;