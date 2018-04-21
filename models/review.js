'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('review', {
    id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    text: DataTypes.TEXT,
    isApproved: DataTypes.BOOLEAN,
    rating: DataTypes.DOUBLE
});
