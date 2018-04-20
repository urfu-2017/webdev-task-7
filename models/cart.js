'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    }, {
        tableName: 'carts'
    });
};
