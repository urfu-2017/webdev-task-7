'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('country', {
    id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.TEXT
});
