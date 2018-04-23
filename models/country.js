'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель страны
    return sequelize.define('countries', {
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
