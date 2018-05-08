'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('countries', {
        name: DataTypes.TEXT
    });
};
