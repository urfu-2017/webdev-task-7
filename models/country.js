'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('country', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: DataTypes.TEXT,
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        indexes: [{ unique: true, fields: ['name'] }]
    });
};
