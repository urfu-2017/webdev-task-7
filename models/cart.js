'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель корзины
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.TEXT,
            allowNull: false,
            foreignKey: true,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    }, {
        timestamps: true,
        tableName: 'carts'
    });
};
