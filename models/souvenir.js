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
        name: DataTypes.STRING,
        image: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            },
            allowNull: true
        },
        price: DataTypes.DOUBLE,
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
