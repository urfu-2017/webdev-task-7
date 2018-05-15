'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        login: { type: DataTypes.TEXT, unique: true }
    });
};

// CREATE TABLE users (
//     id integer NOT NULL,
//     login text,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL
// );
