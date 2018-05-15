'use strict';

module.exports = (sequelize, DataTypes) =>
    sequelize.define('users', {
        login: { type: DataTypes.STRING }
    });
