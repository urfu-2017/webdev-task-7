'use strict';

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            foreignKey: true
        }
    },
    { timestamps: true });
};
