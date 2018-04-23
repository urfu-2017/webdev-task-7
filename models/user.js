'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель юзера
    return sequelize.define('user', {
        login: {
            type: DataTypes.TEXT,
            field: 'login',
            unique: true
        }
    }, {
        timestamps: true
    });
};
