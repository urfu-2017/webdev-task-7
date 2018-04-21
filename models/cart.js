'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('cart', {
    id: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
});
