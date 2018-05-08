'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: DataTypes.STRING,
        price: {
            type: DataTypes.DOUBLE,
            validate: { min: 0 },
            allowNull: false
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 },
            allowNull: false
        },
        amount: {
            type: DataTypes.INTEGER,
            validate: { min: 0 }
        },
        isRecent: DataTypes.BOOLEAN,
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
        indexes: [
            { fields: ['countryId', 'rating', 'price'] }
        ]
    });
};
