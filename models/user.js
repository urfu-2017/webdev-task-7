'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель юзера
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            defaultValue: ''
        },
        login: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'users'
    });
};
