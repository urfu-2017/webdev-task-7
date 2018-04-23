'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель страны
    return sequelize.define('country', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            field: 'id'
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name'
        }
    }, {
        timestamps: true
    });
};
