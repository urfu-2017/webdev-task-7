'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('carts', {
    // Ваша модель корзины
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});
