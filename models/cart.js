'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        }
    });
};
