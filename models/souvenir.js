'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id'
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'name'
        },
        image: {
            type: DataTypes.TEXT,
            field: 'image'
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            field: 'price'
        },
        rating: {
            type: DataTypes.DOUBLE,
            field: 'rating'
        },
        amount: {
            type: DataTypes.INTEGER,
            default: 0,
            field: 'amount'
        },
        isRecent: {
            type: DataTypes.BOOLEAN,
            field: 'isRecent'
        },
        countryId: {
            type: DataTypes.INTEGER,
            foreignKey: true,
            field: 'countryId'
        }
    }, {
        timestamps: true
    });
};
