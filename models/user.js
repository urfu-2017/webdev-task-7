'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login: { type: DataTypes.STRING }
    },
    {
        timestamps: true,
        indexes: [{ fields: ['login'] }]
    });
};
