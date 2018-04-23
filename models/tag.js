'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель тэга
    return sequelize.define('tags', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT
        }
    });
};
