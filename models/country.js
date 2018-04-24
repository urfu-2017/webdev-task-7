'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('countries', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        unique: true
    }
});
