'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart_souvenirs',
        {
            cartId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            souvenirId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            }
        },
        {
            timestamps: true,
            indexes: [
                { fields: ['cartId', 'souvenirId'] }
            ]
        }
    );
};
