'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель юзера
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        login: {
            type: DataTypes.TEXT,
            unique: true
        }
    });
};
