'use strict';

module.exports = (sequelize, { INTEGER, TEXT }) =>
    sequelize.define('users', {
        id:
        {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        login:
        {
            type: TEXT
        }
    });
