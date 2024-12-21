const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Vendedor = require('./seller');

const Produto = sequelize.define('Produto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    vendedorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vendedor,
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
});

Vendedor.hasMany(Produto, { foreignKey: 'vendedorId' });
Produto.belongsTo(Vendedor, { foreignKey: 'vendedorId' });

module.exports = Produto;
