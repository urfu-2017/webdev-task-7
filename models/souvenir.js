'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenir', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            },
            allowNull: true
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        rating: DataTypes.DOUBLE,
        amount: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        isRecent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }, {
        indexes: [{ fields: ['rating', 'price'] }]
    });
};
