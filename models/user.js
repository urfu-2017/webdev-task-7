'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true
        }
    }, {
        tableName: 'users'
    });
};
