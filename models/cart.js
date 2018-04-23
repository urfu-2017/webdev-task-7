'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель корзины
    return sequelize.define('cars', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        }
    });
};
