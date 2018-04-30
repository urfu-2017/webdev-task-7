'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель сувенира
    return sequelize.define('souvenir', {
        name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        image: {
            type: DataTypes.TEXT
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
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
        }
    });
};
