'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('reviews', {
        text: { type: DataTypes.TEXT },
        rating: { type: DataTypes.DOUBLE },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
