'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING },
        image: { type: DataTypes.STRING },
        rating: { type: DataTypes.DOUBLE },
        price: { type: DataTypes.DOUBLE },
        amount: { type: DataTypes.INTEGER },
        isRecent: { type: DataTypes.BOOLEAN }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['rating', 'price'] }]
    });
};
