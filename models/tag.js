'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        name: {
            type: DataTypes.TEXT,
            unique: true
        }
    });
};
