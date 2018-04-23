'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    login: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    }
}, { timestamps: true });
