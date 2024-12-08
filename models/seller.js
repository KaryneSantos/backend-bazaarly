const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Vendedor = sequelize.define('vendedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
    
        type: DataTypes.STRING,
        allowNull: false,
    },
    nome_da_loja: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cnpj: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    endereço_comercial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'id',
        },
        onDelete: 'CASCADE',
    }
});

User.hasOne(Vendedor, { foreignKey: 'userId' });
Vendedor.belongsTo(User, { foreignKey: 'userId' });

module.exports = Vendedor;