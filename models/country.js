'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        name: { type: DataTypes.STRING, unique: true }
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
