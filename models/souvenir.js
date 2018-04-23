'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
