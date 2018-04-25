'use strict';

module.exports = (sequelize, DataTypes) => {
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
            defaultValue: 0,
            validate: { min: 0 }
        },
        isRecent: DataTypes.BOOLEAN,
        countryId: {
            type: DataTypes.INTEGER,
            references: {
                model: sequelize.models.Country,
                key: 'id'
            }
        }
    },
    { indexes: [
        { fields: ['rating', 'price'] }
    ] });
};
