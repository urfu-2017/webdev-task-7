'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        id: { type: DataTypes.INTEGER, allowNull: false, unique: true, primaryKey: true },
        name: { type: DataTypes.STRING, unique: true },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
    }, {
        indexes: [
            {
                name: 'countries_name',
                method: 'BTREE',
                fields: ['name']
            }
        ]
    });
};

// CREATE TABLE countries (
//     id integer NOT NULL,
//     name text,
//     "createdAt" timestamp with time zone NOT NULL,
//     "updatedAt" timestamp with time zone NOT NULL
// );
