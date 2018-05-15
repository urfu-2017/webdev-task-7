'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('tags', {
        name: { type: DataTypes.STRING }
    });
