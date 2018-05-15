'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        name: { type: DataTypes.STRING }
    });
};

// CREATE TABLE tags (
//     id integer NOT NULL,
//     name text,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL
// );
