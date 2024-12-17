const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Vendedor = sequelize.define('vendedor', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nome_da_loja: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endereco_comercial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    telefone: {
        type: DataTypes.STRING,
        allowNull: false
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