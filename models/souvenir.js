'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('souvenirs', {
        name: { type: DataTypes.STRING },
        image: { type: DataTypes.TEXT },
        price: { type: DataTypes.DOUBLE },
        rating: { type: DataTypes.DOUBLE },
        amount: { type: DataTypes.INTEGER },
        isRecent: { type: DataTypes.BOOLEAN }
    }, {
        indexes: [
            {
                fields: ['rating', 'price']
            }
        ]
    });
