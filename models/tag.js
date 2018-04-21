'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.TEXT
    });
};
