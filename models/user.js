'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true
    });
};
