'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            notNull: true
        },
        image: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DOUBLE,
            notNull: true
        },
        rating: {
            type: DataTypes.DOUBLE
        },
        amount: {
            type: DataTypes.INTEGER,
            default: 0
        },
        isRecent: {
            type: DataTypes.BOOLEAN
        },
        countryId: {
            type: DataTypes.INTEGER
        }
    });
};
