'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('reviews', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    text: DataTypes.TEXT,
    isApproved: { type: DataTypes.BOOLEAN, defaultValue: false },
    rating: DataTypes.DOUBLE
});
