'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель корзины
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.TEXT,
            allowNull: false,
            foreignKey: true
        }
    }, {
        timestamps: true,
        tableName: 'carts'
    });
};
