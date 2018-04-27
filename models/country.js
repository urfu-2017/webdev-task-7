'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель страны
    return sequelize.define('countries', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: DataTypes.TEXT
    },
    {
        timestamp: true
    });
};
