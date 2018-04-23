'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель корзины
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id'
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            field: 'userId'
        }
    }, {
        timestamps: true
    });
};
