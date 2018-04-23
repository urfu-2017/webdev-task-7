'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tag', {
        id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    });
};

// CREATE TABLE tags (
//     id integer NOT NULL,
//     name text,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL
// );
