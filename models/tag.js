'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tags', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: { type: DataTypes.STRING }
    },
    {
        timestamps: true
    });
};
