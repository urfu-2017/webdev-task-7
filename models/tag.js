'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT
        }
    });
};
