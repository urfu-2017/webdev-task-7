'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        login: {
            type: DataTypes.TEXT
        }
    });
};
