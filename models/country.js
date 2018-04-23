'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель страны
    return sequelize.define('countries', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.TEXT
    });
};
