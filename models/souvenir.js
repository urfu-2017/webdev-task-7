'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount: {
            type: DataTypes.INTEGER
        },
        image: {
            type: DataTypes.TEXT
        },
        isRecent: {
            type: DataTypes.BOOLEAN
        },
        name: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DOUBLE
        },
        rating: {
            type: DataTypes.DOUBLE
        },
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    }, {
        indexes: [{ fields: ['rating', 'price'] }]
    });
};
