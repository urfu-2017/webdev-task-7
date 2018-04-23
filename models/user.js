'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        login: { type: DataTypes.TEXT, unique: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
};

// CREATE TABLE users (
//     id integer NOT NULL,
//     login text,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL
// );
