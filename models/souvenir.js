'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('souvenirs',
    {
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
            allowNull: false
        },
        rating: DataTypes.DOUBLE,
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isRecent: {
            type: DataTypes.BOOLEAN
        },
        countryId: {
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['countryId', 'rating', 'price'] }]
    }
);
