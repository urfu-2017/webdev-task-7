'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT
        },
        image: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DOUBLE
        },
        rating: {
            type: DataTypes.DOUBLE
        },
        amount: {
            type: DataTypes.INTEGER
        },
        isRecent: {
            type: DataTypes.BOOLEAN
        },
        countryId: {
            type: DataTypes.INTEGER
        }
    }, {
        indexes: [
            {
                fields: ['rating']
            },
            {
                fields: ['price']
            }
        ]
    });
};
