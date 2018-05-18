'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: { type: DataTypes.TEXT },
        rating: { type: DataTypes.DOUBLE },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isRecent: { type: DataTypes.BOOLEAN },
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'countries',
                key: 'id'
            }
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['rating', 'price'] }]
    });
};
