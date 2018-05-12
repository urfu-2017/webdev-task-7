'use strict';

module.exports = (sequelize, { BOOLEAN, DOUBLE, INTEGER, TEXT }) =>
    sequelize.define('reviews', {
        id:
        {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        isApproved:
        {
            type: BOOLEAN,
            defaultValue: false
        },
        rating:
        {
            type: DOUBLE
        },
        text:
        {
            type: TEXT
        },
        souvenirId:
        {
            type: INTEGER,
            references:
            {
                model: 'souvenirs',
                key: 'id'
            }
        },
        userId: {
            type: INTEGER,
            references:
            {
                model: 'users',
                key: 'id'
            }
        }
    });
