'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('countries', {
        name: {
            type: DataTypes.TEXT,
            unique: true
        }
    });
};
