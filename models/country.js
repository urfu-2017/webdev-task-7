'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель страны
    return sequelize.define('country', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                is: /^[a-z]+$/i
            }
        }
    }, {
        indexes: [{ fields: ['name'] }]
    });
};
