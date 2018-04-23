'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('tags', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: DataTypes.TEXT
}, { timestamps: true });
