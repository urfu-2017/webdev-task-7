'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('user', {
    id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    login: DataTypes.TEXT
});
