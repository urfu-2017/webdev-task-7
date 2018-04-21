'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель тэга
    return sequelize.define('tag', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            defaultValue: ''
        },
        name: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        tableName: 'tags'
    });
};
