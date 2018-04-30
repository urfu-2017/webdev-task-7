'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель юзера
    return sequelize.define('user', {
        login: {
            type: DataTypes.TEXT,
            unique: true
        }
    });
};
