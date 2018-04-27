'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель тэга
    return sequelize.define('tags', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: DataTypes.TEXT
    },
    {
        timestamp: true
    });
};
