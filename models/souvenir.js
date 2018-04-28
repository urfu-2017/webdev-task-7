'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.TEXT,
        isRecent: DataTypes.BOOLEAN,
        image: DataTypes.TEXT,
        price: DataTypes.DOUBLE,
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
        },
        amount: DataTypes.INTEGER,
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    },
    {
        indexes: [{
            fields: ['price', 'rating']
        }]
    });
};
