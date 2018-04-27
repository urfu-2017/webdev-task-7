'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель юзера
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        login: DataTypes.TEXT
    },
    {
        timestamp: true
    });
};
