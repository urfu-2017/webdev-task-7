'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cart_souvenirs', {
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'carts',
                key: 'id'
            }
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'souvenirs',
                key: 'id'
            }
        }
    }, {
        tableName: 'cart_souvenirs'
    });
};
