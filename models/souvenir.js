'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenirs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
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
            default: 0
        },
        isRecent: DataTypes.BOOLEAN,
        countryId: DataTypes.INTEGER
    },
    {
        timestamp: true
    });
};
