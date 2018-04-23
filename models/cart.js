'use strict';

module.exports = (sequelize, { INTEGER }) =>
    sequelize.define('carts', {
        id:
        {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId:
        {
            type: INTEGER,
            references:
            {
                model: 'users',
                key: 'id'
            }
        }
    });
