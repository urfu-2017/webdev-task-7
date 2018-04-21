'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('tag', {
    id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    name: DataTypes.TEXT
});
