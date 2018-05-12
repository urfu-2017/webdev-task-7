'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        name: {
            type: DataTypes.TEXT
        }
    });
};
