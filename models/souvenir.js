'use strict';

module.exports = (sequelize, { BOOLEAN, DOUBLE, INTEGER, TEXT }) =>
    sequelize.define('souvenirs', {
        id:
        {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        amount:
        {
            type: INTEGER
        },
        image:
        {
            type: TEXT
        },
        isRecent:
        {
            type: BOOLEAN
        },
        name:
        {
            type: TEXT
        },
        price:
        {
            type: DOUBLE
        },
        rating:
        {
            type: DOUBLE
        },
        countryId:
        {
            type: INTEGER,
            references:
            {
                model: 'countries',
                key: 'id'
            }
        }
    }, { indexes: [{ fields: ['rating', 'price'] }] });
