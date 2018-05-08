'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        name: DataTypes.TEXT
    });
};
