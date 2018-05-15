'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('countries', {
        name: { type: DataTypes.STRING }
    });
