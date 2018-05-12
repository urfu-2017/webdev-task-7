'use strict';

module.exports = (sequelize, { INTEGER, TEXT }) =>
    sequelize.define('tags', {
        id:
        {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:
        {
            type: TEXT
        }
    });
