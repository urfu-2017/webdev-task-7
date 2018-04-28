'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель тэга

    return sequelize.define('tags', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: DataTypes.TEXT
    });
};
