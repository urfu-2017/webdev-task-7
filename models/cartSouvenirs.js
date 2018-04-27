'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель корзины
    return sequelize.define('cart_souvenir', {
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    },
    {
        timestamp: true,
        indexes: [
            { fields: ['cartId', 'souvenirId'] }
        ]
    });
};
