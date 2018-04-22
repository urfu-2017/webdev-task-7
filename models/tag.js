'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('tags', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.TEXT
});
