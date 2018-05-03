'use strict';

module.exports = (sequelize, DataTypes) => {
    // Ваша модель корзины
    return sequelize.define('carts', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    });
};
