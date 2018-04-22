'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('reviews', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: DataTypes.TEXT
    },
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.DOUBLE
    }
}, {
    timestamps: true
});
