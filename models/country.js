'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('countries', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: DataTypes.TEXT
});
