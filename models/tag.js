'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель тэга
    return sequelize.define('tags', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true
        }
    });
};
