'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('cart_souvenirs',
    {
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        souvenirId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['cartId', 'souvenirId'] }]
    }
);
