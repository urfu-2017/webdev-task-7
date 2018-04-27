'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('countries', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.TEXT
    },
    {
        timestamps: true,
        indexes: [{ unique: true, fields: ['name'] }]
    });
};
