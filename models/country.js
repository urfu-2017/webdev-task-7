'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('countries', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.TEXT
});
