'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        userId: DataTypes.INTEGER
    });
};
