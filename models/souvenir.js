'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: DataTypes.TEXT,
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            validate: { min: 0 }
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
        },
        amount: {
            type: DataTypes.INTEGER,
            validate: { min: 0 },
            defaultValue: 0
        },
        isRecent: DataTypes.BOOLEAN,
        countryId: {
            type: DataTypes.INTEGER,
            reference: {
                model: 'countries',
                key: 'id'
            }
        }
    }, {
        indexes: [{
            fields: ['rating', 'price']
        }]
    });
};
