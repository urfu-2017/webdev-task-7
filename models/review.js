'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('reviews', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: DataTypes.STRING,
    rating: DataTypes.FLOAT,
    isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});
