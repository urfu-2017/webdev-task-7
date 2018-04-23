'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            notNull: true
        },
        name: {
            type: DataTypes.TEXT
        }
    });
};
