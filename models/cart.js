'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('carts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
},
{ timestamps: true }
);
