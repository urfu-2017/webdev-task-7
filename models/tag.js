'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('tags', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        unique: true
    }
});
