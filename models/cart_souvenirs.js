'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('cart_souvenirs', {
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};
