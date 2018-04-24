'use strict';

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('country', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'countries'
    });
};
