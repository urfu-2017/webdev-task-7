'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true
        },
        login: {
            type: DataTypes.TEXT
        }
    });
};
