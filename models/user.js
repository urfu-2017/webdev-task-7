'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        login: {
            type: DataTypes.TEXT,
            unique: true
        }
    });
};
