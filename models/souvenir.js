'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('souvenir', {
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
        }
    });
};
