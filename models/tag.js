'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('tags', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING }
    });
