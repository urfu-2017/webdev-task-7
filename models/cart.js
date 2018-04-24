'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }
    }, {
        tableName: 'carts'
    });
};
