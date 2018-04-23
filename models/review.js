'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: { type: DataTypes.TEXT },
        rating: { type: DataTypes.DOUBLE },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
