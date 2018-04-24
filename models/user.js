'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: {
        type: DataTypes.TEXT,
        unique: true
    }
});
