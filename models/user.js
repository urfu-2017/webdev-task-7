'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: {
            type: DataTypes.STRING,
            unique: true
        }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['login'] }]
    });
};
