'use strict';

module.exports = function (sequelize, DataTypes) {
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
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'carts',
                key: 'id'
            }
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'souvenir',
                key: 'id'
            }
        }
    }, {
        tableName: 'cart_souvenirs'
    });
};
