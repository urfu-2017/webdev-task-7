'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('countries', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.STRING
    });
};
