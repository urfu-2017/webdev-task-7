'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.TEXT,
        image: DataTypes.TEXT,
        price: {
            type: DataTypes.DOUBLE,
            validate: { min: 0 }
        },
        rating: {
            type: DataTypes.DOUBLE,
            validate: { min: 0, max: 5 }
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
    });
};
